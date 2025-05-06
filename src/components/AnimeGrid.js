import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Skeleton,
} from '@mui/material';

/**
 * Displays the search results grid (or loading/empty states).
 * @param {Object[]} results - Array of anime objects from the API.
 * @param {boolean} loading - Whether data is currently loading.
 * @param {(id: number) => void} onCardClick - Callback for when an anime card is clicked.
 */
export default function AnimeGrid({ results, loading, onCardClick }) {
  if (loading) {
    return (
      <Grid container spacing={3} justifyContent="center">
        {Array.from({ length: 20 }).map((_, idx) => (
          <Grid item key={idx}>
            <Skeleton variant="rectangular" width={280} height={350} />
            <Skeleton width="80%" />
            <Skeleton width="40%" />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!results.length) {
    return (
      <Box mt={4} textAlign="center">
        No results found.
      </Box>
    );
  }

  return (
    <Grid container spacing={4} justifyContent="center">
      {results.map((anime, i) => (
        <Grid item xs={12} sm={6} md={3} key={`${anime.mal_id}-${i}`}>             
          <Card
            sx={{
              width: 225,
              height: 500,
              backgroundColor: 'background.paper',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.05)', cursor: 'pointer' },
            }}
          >
            <CardActionArea onClick={() => onCardClick(anime.mal_id)}>
              <Box
                sx={{
                  width: 225,
                  height: 355,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#222',
                }}
              >
                <CardMedia
                  component="img"
                  image={anime.images.jpg.image_url}
                  alt={anime.title}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <CardContent>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold', mb: 1, color: 'white' }}>
                  {anime.title}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: 'white' }}>
                  Episodes: {anime.episodes ?? 'N/A'}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: 'white' }}>
                  Status: {anime.status}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}