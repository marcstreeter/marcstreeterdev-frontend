import {
  CheckCircle,
  Error as ErrorIcon,
  ExpandMore,
  Refresh,
  Schedule,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { apiUrl } from '../settings';

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'loading' | 'error';
  responseTime?: number;
  lastChecked?: Date;
  error?: string;
}

interface LLMProviderResult {
  provider: string;
  elapsed?: number;
  output: string;
  prompt: string;
  status:
    | 'ok'
    | 'failed'
    | 'timeout'
    | 'no request was made because there was no configuration present for this provider';
}

interface LLMStatus {
  results: LLMProviderResult[];
  lastChecked?: Date;
  isLoading: boolean;
  error?: string;
}

const StatusPage: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    status: 'loading',
  });
  const [llmStatus, setLlmStatus] = useState<LLMStatus>({
    results: [],
    isLoading: false,
  });
  const [isPolling, setIsPolling] = useState(false);
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>(() => {
    // Initialize from localStorage or use default prompt
    const saved = localStorage.getItem('llm-custom-prompt');
    return (
      saved ||
      "give me the name of the main villain's cat in the show the smurfs"
    );
  });

  const checkHealth = useCallback(async () => {
    setIsPolling(true);
    const startTime = Date.now();

    try {
      const response = await fetch(`${apiUrl('health/general')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (response.ok) {
        await response.json(); // Consume the response
        setHealthStatus({
          status: 'healthy',
          responseTime,
          lastChecked: new Date(),
        });
      } else {
        setHealthStatus({
          status: 'unhealthy',
          responseTime,
          lastChecked: new Date(),
          error: `HTTP ${response.status}: ${response.statusText}`,
        });
      }
    } catch (error: unknown) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const errorMessage =
        error instanceof Error ? (error as Error).message : String(error);

      setHealthStatus({
        status: 'error',
        responseTime,
        lastChecked: new Date(),
        error: errorMessage,
      });
    } finally {
      setIsPolling(false);
    }
  }, []);

  const checkLLMStatus = useCallback(
    async (forceRefresh: boolean = false) => {
      setLlmStatus((prev) => ({ ...prev, isLoading: true, error: undefined }));

      try {
        const params = new URLSearchParams();
        if (forceRefresh) {
          params.append('force_refresh', 'true');
        }
        if (customPrompt) {
          params.append('prompt', customPrompt);
        }

        const url = `${apiUrl('health/llm')}?${params.toString()}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLlmStatus({
            results: data.results || [],
            lastChecked: new Date(),
            isLoading: false,
          });
        } else {
          setLlmStatus({
            results: [],
            lastChecked: new Date(),
            isLoading: false,
            error: `HTTP ${response.status}: ${response.statusText}`,
          });
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? (error as Error).message : String(error);
        setLlmStatus({
          results: [],
          lastChecked: new Date(),
          isLoading: false,
          error: errorMessage,
        });
      }
    },
    [customPrompt]
  );

  const getLLMStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle color="success" sx={{ fontSize: 20 }} />;
      case 'failed':
      case 'timeout':
        return <ErrorIcon color="error" sx={{ fontSize: 20 }} />;
      case 'no request was made because there was no configuration present for this provider':
        return <Schedule color="action" sx={{ fontSize: 20 }} />;
      default:
        return <Schedule color="action" sx={{ fontSize: 20 }} />;
    }
  };

  const getLLMStatusColor = (
    status: string
  ): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'ok':
        return 'success';
      case 'failed':
      case 'timeout':
        return 'error';
      case 'no request was made because there was no configuration present for this provider':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getLLMStatusText = (status: string) => {
    switch (status) {
      case 'ok':
        return 'Working';
      case 'failed':
        return 'Failed';
      case 'timeout':
        return 'Timeout';
      case 'no request was made because there was no configuration present for this provider':
        return 'Not Configured';
      default:
        return 'Unknown';
    }
  };

  const handleProviderExpand = (provider: string) => {
    setExpandedProvider(expandedProvider === provider ? null : provider);
  };

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPrompt = event.target.value;
    setCustomPrompt(newPrompt);
    // Save to localStorage
    localStorage.setItem('llm-custom-prompt', newPrompt);
  };

  const _truncateOutput = (output: string, maxLength: number = 100) => {
    if (output.length <= maxLength) return output;
    return `${output.substring(0, maxLength)}...`;
  };

  useEffect(() => {
    // Initial checks
    checkHealth();
    checkLLMStatus();

    // Poll health every 30 seconds
    const healthInterval = setInterval(checkHealth, 30000);

    // Poll LLM status every 2 minutes (since it's cached for 1 minute)
    const llmInterval = setInterval(() => checkLLMStatus(), 120000);

    return () => {
      clearInterval(healthInterval);
      clearInterval(llmInterval);
    };
  }, [checkHealth, checkLLMStatus]);

  const getStatusIcon = () => {
    switch (healthStatus.status) {
      case 'healthy':
        return <CheckCircle color="success" sx={{ fontSize: 40 }} />;
      case 'unhealthy':
      case 'error':
        return <ErrorIcon color="error" sx={{ fontSize: 40 }} />;
      case 'loading':
        return <CircularProgress size={40} />;
      default:
        return <Schedule color="action" sx={{ fontSize: 40 }} />;
    }
  };

  const getStatusColor = (): 'success' | 'error' | 'info' | 'default' => {
    switch (healthStatus.status) {
      case 'healthy':
        return 'success';
      case 'unhealthy':
      case 'error':
        return 'error';
      case 'loading':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusText = () => {
    switch (healthStatus.status) {
      case 'healthy':
        return 'API is healthy';
      case 'unhealthy':
        return 'API is unhealthy';
      case 'error':
        return 'API connection error';
      case 'loading':
        return 'Checking API status...';
      default:
        return 'Unknown status';
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          System Status
        </Typography>

        {/* API Status Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {getStatusIcon()}
              <Box>
                <Typography variant="h5" component="h2">
                  Backend API
                </Typography>
                <Chip
                  label={getStatusText()}
                  color={getStatusColor()}
                  variant="outlined"
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Endpoint
                </Typography>
                <Typography variant="body2" fontFamily="monospace">
                  GET /health/general
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Response Time
                </Typography>
                <Typography variant="body2">
                  {healthStatus.responseTime
                    ? `${healthStatus.responseTime}ms`
                    : 'N/A'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Checked
                </Typography>
                <Typography variant="body2">
                  {healthStatus.lastChecked
                    ? healthStatus.lastChecked.toLocaleTimeString()
                    : 'Never'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Polling Status
                </Typography>
                <Typography variant="body2">
                  {isPolling ? 'Checking...' : 'Idle (30s interval)'}
                </Typography>
              </Box>
            </Box>

            {healthStatus.error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <AlertTitle>Error Details</AlertTitle>
                {healthStatus.error}
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* LLM Status Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {llmStatus.isLoading ? (
                  <CircularProgress size={40} />
                ) : (
                  <CheckCircle color="success" sx={{ fontSize: 40 }} />
                )}
                <Box>
                  <Typography variant="h5" component="h2">
                    LLM Providers
                  </Typography>
                  <Chip
                    label={`${llmStatus.results.filter((r) => r.status === 'ok').length}/${llmStatus.results.length} Working`}
                    color="success"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  label="Custom Prompt"
                  value={customPrompt}
                  onChange={handlePromptChange}
                  size="small"
                  sx={{ minWidth: 300 }}
                  placeholder="Enter a prompt to test LLM providers..."
                />
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => checkLLMStatus(true)}
                  disabled={llmStatus.isLoading}
                >
                  Refresh
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2,
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Endpoint
                </Typography>
                <Typography variant="body2" fontFamily="monospace">
                  GET /health/llm
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {llmStatus.lastChecked
                    ? llmStatus.lastChecked.toLocaleTimeString()
                    : 'Never'}
                </Typography>
              </Box>
            </Box>

            {/* Provider Status Grid */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {llmStatus.results.map((provider) => (
                <Accordion
                  key={provider.provider}
                  expanded={expandedProvider === provider.provider}
                  onChange={() => handleProviderExpand(provider.provider)}
                  sx={{
                    '&:before': { display: 'none' },
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      '&:hover': { backgroundColor: 'action.hover' },
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        width: '100%',
                      }}
                    >
                      {getLLMStatusIcon(provider.status)}
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 'medium',
                          }}
                        >
                          {provider.provider}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <Chip
                            label={getLLMStatusText(provider.status)}
                            color={getLLMStatusColor(provider.status)}
                            size="small"
                            variant="outlined"
                          />
                          {provider.elapsed && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {provider.elapsed.toFixed(2)}s
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                      {/* Prompt */}
                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Prompt
                        </Typography>
                        <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                          <Typography variant="body2" fontFamily="monospace">
                            {provider.prompt}
                          </Typography>
                        </Paper>
                      </Box>

                      {/* Output */}
                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Response
                        </Typography>
                        <Paper
                          sx={{
                            p: 2,
                            backgroundColor: 'grey.50',
                            maxHeight: 300,
                            overflow: 'auto',
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontFamily="monospace"
                            whiteSpace="pre-wrap"
                          >
                            {provider.output}
                          </Typography>
                        </Paper>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            {llmStatus.error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <AlertTitle>Error Details</AlertTitle>
                {llmStatus.error}
              </Alert>
            )}
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            This page automatically polls the API health endpoint every 30
            seconds and LLM status every 2 minutes.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default StatusPage;
