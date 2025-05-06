import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import {
  Box,
  TextField,
  Typography,
  Pagination,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Skeleton,
  MenuItem,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [filters, setFilters] = useState({
    type: "",
    filter: "",
    rating: "",
    sfw: false,
  });

  const navigate = useNavigate();
  const bannerInterval = useRef(null);

  // --- core fetch with 429-guard ---
  const fetchAnime = (q, p, f) => {
    setLoading(true);
    const basePath = q ? "/anime" : "/top/anime";
    const params = new URLSearchParams({ page: p });
    if (q) {
      params.set("q", q);
    } else {
      if (f.filter) params.set("filter", f.filter);
      if (f.type) params.set("type", f.type);
      if (f.rating) params.set("rating", f.rating);
      if (f.sfw) params.set("sfw", "true");
    }

    fetch(`https://api.jikan.moe/v4${basePath}?${params.toString()}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        const list = Array.isArray(data.data) ? data.data : [];
        setResults(list.slice(0, 21));
        setPageCount(data.pagination?.last_visible_page || 1);
      })
      .catch(err => {
        console.error(err);
        if (err.message.includes("429")) {
          console.warn("Rate limit hit — slow down your requests.");
        }
        setResults([]);
        setPageCount(1);
      })
      .finally(() => setLoading(false));
  };

  // --- debounce all inputs together ---
  const debouncedFetch = useRef(
    debounce((q, p, f) => {
      fetchAnime(q, p, f);
    }, 500)
  ).current;

  // cancel debounce on unmount
  useEffect(() => () => debouncedFetch.cancel(), [debouncedFetch]);

  // whenever search, page, or filters change, wait 500ms then fetch
  useEffect(() => {
    debouncedFetch(search, page, filters);
  }, [search, page, filters, debouncedFetch]);

  // --- banner carousel ---
  useEffect(() => {
    if (results.length > 0) {
      bannerInterval.current = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % Math.min(results.length, 5));
      }, 4000);
      return () => clearInterval(bannerInterval.current);
    }
  }, [results]);

  // --- recommendations (once) ---
  useEffect(() => {
    fetch("https://api.jikan.moe/v4/recommendations/anime")
      .then(res => res.json())
      .then(data => {
        const unique = data.data
          .filter(
            (item, i, self) =>
              i === self.findIndex(t => t.entry[0].mal_id === item.entry[0].mal_id)
          )
          .slice(0, 10);
        setRecommended(unique);
      })
      .catch(console.error);
  }, []);

  const handleCardClick = id => navigate(`/anime/${id}`);
  const topBanners = recommended;

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default", color: "text.primary", p: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Navigation Bar */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
            Myanime
          </Typography>

          {/* Filters */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {/* Type */}
            <TextField
              select
              label="Type"
              size="small"
              value={filters.type}
              onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
              sx={{ minWidth: 200 }}
              SelectProps={{
                displayEmpty: true,
                renderValue: sel => (sel ? sel.toUpperCase() : ""),
              }}
              InputProps={{
                endAdornment: filters.type && (
                  <InputAdornment position="start">
                    <IconButton size="small" onClick={() => setFilters(f => ({ ...f, type: "" }))}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            >
              {["tv", "movie", "ova", "special", "ona", "music", "cm", "pv", "tv special"].map(t => (
                <MenuItem key={t} value={t}>
                  {t.toUpperCase()}
                </MenuItem>
              ))}
            </TextField>

            {/* Top Filter */}
            <TextField
              select
              label="Top Filter"
              size="small"
              value={filters.filter}
              onChange={e => setFilters(f => ({ ...f, filter: e.target.value }))}
              sx={{ minWidth: 200 }}
              SelectProps={{
                displayEmpty: true,
                renderValue: sel => sel || "",
              }}
              InputProps={{
                endAdornment: filters.filter && (
                  <InputAdornment position="start">
                    <IconButton size="small" onClick={() => setFilters(f => ({ ...f, filter: "" }))}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            >
              {["Airing", "Upcoming", "By Popularity", "Favorite"].map(flt => (
                <MenuItem key={flt} value={flt}>
                  {flt}
                </MenuItem>
              ))}
            </TextField>

            {/* Rating */}
            <TextField
              select
              label="Rating"
              size="small"
              value={filters.rating}
              onChange={e => setFilters(f => ({ ...f, rating: e.target.value }))}
              sx={{ minWidth: 200 }}
              SelectProps={{
                displayEmpty: true,
                renderValue: sel => (sel ? sel.toUpperCase() : ""),
              }}
              InputProps={{
                endAdornment: filters.rating && (
                  <InputAdornment position="start">
                    <IconButton size="small" onClick={() => setFilters(f => ({ ...f, rating: "" }))}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            >
              {["g", "pg", "pg13", "r17"].map(r => (
                <MenuItem key={r} value={r}>
                  {r.toUpperCase()}
                </MenuItem>
              ))}
            </TextField>

            {/* SFW */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.sfw}
                  onChange={e => setFilters(f => ({ ...f, sfw: e.target.checked }))}
                />
              }
              label="SFW Only"
            />
          </Box>

          {/* Search */}
          <Box sx={{ flexBasis: { xs: "100%", sm: "auto" }, minWidth: 250 }}>
            <TextField
              label="Search Anime"
              variant="outlined"
              fullWidth
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ bgcolor: "black" }}
            />
          </Box>
        </Box>

        {/* Top Banner Carousel */}
        {topBanners.length > 0 && (
          <Box sx={{ position: "relative", overflow: "hidden", height: 250, mb: 4, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                transition: "transform 0.6s ease-in-out",
                transform: `translateX(-${currentBanner * 100}%)`,
                width: `${topBanners.length * 10}%`,
              }}
            >
              {topBanners.map((rec, i) => {
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
                    onClick={() => handleCardClick(anime.mal_id)}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1, color: "white" }}>
                        {anime.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "white" }}>
                        {rec.content?.length > 100
                          ? rec.content.slice(0, 100) + "…"
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
        )}

        {/* Anime Grid */}
        {loading ? (
          <Grid container spacing={3} justifyContent="center">
            {Array.from({ length: 20 }).map((_, idx) => (
              <Grid item key={idx}>
                <Skeleton variant="rectangular" width={280} height={350} />
                <Skeleton width="80%" />
                <Skeleton width="40%" />
              </Grid>
            ))}
          </Grid>
        ) : !results.length ? (
          <Box mt={4} textAlign="center">
            No results found.
          </Box>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {results.map((anime, i) => (
              <Grid item xs={12} sm={6} md={3} key={`${anime.mal_id}-${i}`}>
                <Card
                  sx={{
                    width: 225,
                    height: 500,
                    backgroundColor: "background.paper",
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "scale(1.05)", cursor: "pointer" },
                  }}
                >
                  <CardActionArea onClick={() => handleCardClick(anime.mal_id)}>
                    <Box
                      sx={{
                        width: 225,
                        height: 355,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#222",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={anime.images.jpg.image_url}
                        alt={anime.title}
                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Box>
                    <CardContent>
                      <Typography sx={{ fontSize: "1.1rem", fontWeight: "bold", mb: 1, color: "white" }}>
                        {anime.title}
                      </Typography>
                      <Typography sx={{ fontSize: "0.9rem" }}>Episodes: {anime.episodes ?? "N/A"}</Typography>
                      <Typography sx={{ fontSize: "0.9rem" }}>Status: {anime.status}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} color="primary" />
        </Box>
      </Box>
    </Box>
  );
}
