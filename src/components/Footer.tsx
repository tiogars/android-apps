import { Box, Container, IconButton, Tooltip, Typography } from '@mui/material';
import { GitHub, BugReport } from '@mui/icons-material';

export default function Footer() {
  const handleRepoClick = () => {
    window.open('https://github.com/tiogars/android.tiogars.fr', '_blank');
  };

  const handleIssueClick = () => {
    window.open('https://github.com/tiogars/android.tiogars.fr/issues/new', '_blank');
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Tooltip title="View Repository">
            <IconButton
              color="primary"
              aria-label="view repository"
              onClick={handleRepoClick}
            >
              <GitHub />
            </IconButton>
          </Tooltip>
          <Typography variant="body2" color="text.secondary">
            |
          </Typography>
          <Tooltip title="Report an Issue">
            <IconButton
              color="primary"
              aria-label="report issue"
              onClick={handleIssueClick}
            >
              <BugReport />
            </IconButton>
          </Tooltip>
        </Box>
      </Container>
    </Box>
  );
}
