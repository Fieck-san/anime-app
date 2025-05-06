import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * Displays a horizontal sliding banner carousel of anime recommendations.
 * @param {{ entry: { mal_id: number, title: string, images: { jpg: { large_image_url: string } } }[], content?: string }[]} banners
 * @param {number} currentBanner Index of the banner to show.
 * @param {(id: number) => void} onCardClick Callback when a banner is clicked.
 */
export default function Banner({ banners, currentBanner, onCardClick }) {
  if (!banners || banners.length === 0) return null;

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        height: 250,
        mb: 4,
        borderRadius: 2,
      }}
    >
      {/* Title and Divider */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 16,
          zIndex: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: "bold",
            backgroundColor: "rgba(0,0,0,0.5)",
            px: 1,
            borderRadius: 1,
          }}
        >
          Anime Recommendation
        </Typography>

        {/* Divider Line */}
        <Box
          sx={{
            mt: 1, // margin top between title and line
            mb: 1.5, // 👈 margin bottom after the line
            width: "500px",
            height: "2px",
            backgroundColor: "#ffffff88", // soft white
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          transition: "transform 1s ease-in-out",
          transform: `translateX(-${currentBanner * 100}%)`,
          width: `${banners.length * 10}%`,
        }}
      >
        {banners.map((rec, i) => {
          const anime = rec.entry[0];
          return (
            <Box
              key={`${anime.mal_id}-${i}`}
              sx={{
                flex: "0 0 100%",
                height: 250,
                display: "flex",
                bgcolor: "#000",
                alignItems: "center",
                justifyContent: "space-between",
                px: 4,
                cursor: "pointer",
              }}
              onClick={() => onCardClick(anime.mal_id)}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", mb: 1, color: "white" }}
                >
                  {anime.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "white",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {rec.content?.length > 130
                    ? rec.content.slice(0, 130) + "…"
                    : rec.content || "No description available."}
                </Typography>
              </Box>

              <Box
                component="img"
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                sx={{
                  width: 120,
                  height: 180,
                  objectFit: "cover",
                  border: "1px solid #333",
                  borderRadius: 1,
                  ml: 3,
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
