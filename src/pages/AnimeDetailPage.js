import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper
} from '@mui/material';

export default function AnimeDetailPage() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://api.jikan.moe/v4/anime/${id}/full`)
      .then(res => res.json())
      .then(data => setAnime(data.data));
  }, [id]);

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        p: 4,
      }}
    >
      <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>
        <Button
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={{ mb: 4 }}
        >
          ← Back
        </Button>

        {!anime ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#1e1e1e' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
              }}
            >
              <Box
                component="img"
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                sx={{
                  width: { xs: '100%', md: 300 },
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {anime.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Status:</strong> {anime.status}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Episodes:</strong> {anime.episodes}
                </Typography>
                <Typography variant="body2" mt={2}>
                  {anime.synopsis}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
