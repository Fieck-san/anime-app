import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";

export default function AnimeDetailPage() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://api.jikan.moe/v4/anime/${id}/full`)
      .then((res) => res.json())
      .then((data) => setAnime(data.data))
      .catch(console.error);
  }, [id]);

  if (!anime) {
    return (
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          p: 4,
        }}
      >
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        p: 4,
      }}
    >
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        <Button onClick={() => navigate(-1)} variant="outlined" sx={{ mb: 4 }}>
          ← Back
        </Button>

        <Paper elevation={3} sx={{ p: 3, backgroundColor: "#1e1e1e" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
            }}
          >
            {/* Cover Image */}
            <Box
              component="img"
              src={anime.images.jpg.large_image_url}
              alt={anime.title}
              sx={{
                width: { xs: "100%", md: 300 },
                borderRadius: 2,
                boxShadow: 3,
              }}
            />

            {/* Details Column */}
            <Box sx={{ flex: 1 }}>
              {/* Title */}
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {anime.title}
              </Typography>

              {/* Stats Panel */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                {/* Score */}
                <Paper
                  elevation={1}
                  sx={{
                    p: 1,
                    minWidth: 150,
                    textAlign: "center",
                    backgroundColor: "#2a2a2a",
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Score
                  </Typography>
                  <Typography variant="h6">
                    {anime.score?.toFixed(2)}{" "}
                    <Typography component="span" variant="caption" color="text.secondary">
                      ({anime.scored_by.toLocaleString()})
                    </Typography>
                  </Typography>
                </Paper>

                {/* Rank */}
                <Paper
                  elevation={1}
                  sx={{
                    p: 1,
                    minWidth: 150,
                    textAlign: "center",
                    backgroundColor: "#2a2a2a",
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Rank
                  </Typography>
                  <Typography variant="h6">#{anime.rank}</Typography>
                </Paper>

                {/* Popularity */}
                <Paper
                  elevation={1}
                  sx={{
                    p: 1,
                    minWidth: 150,
                    textAlign: "center",
                    backgroundColor: "#2a2a2a",
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Popularity
                  </Typography>
                  <Typography variant="h6">#{anime.popularity}</Typography>
                </Paper>

                {/* Members */}
                <Paper
                  elevation={1}
                  sx={{
                    p: 1,
                    minWidth: 150,
                    textAlign: "center",
                    backgroundColor: "#2a2a2a",
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Members
                  </Typography>
                  <Typography variant="h6">
                    {anime.members.toLocaleString()}
                  </Typography>
                </Paper>
              </Box>

              {/* Other Details */}
              <Typography variant="body1" gutterBottom>
                <strong>Status:</strong> {anime.status}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Episodes:</strong> {anime.episodes}
              </Typography>

              {/* Synopsis */}
              <Typography variant="body2" mt={2}>
                {anime.synopsis}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
