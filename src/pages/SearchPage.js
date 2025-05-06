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
} from "@mui/material";
import FilterBar from "../components/FilterBar";
import BannerCarousel from "../components/Banner";
import AnimeGrid from "../components/AnimeGrid";

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
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data.data) ? data.data : [];
        setResults(list.slice(0, 21));
        setPageCount(data.pagination?.last_visible_page || 1);
      })
      .catch((err) => {
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
        setCurrentBanner((prev) => (prev + 1) % Math.min(results.length, 5));
      }, 4000);
      return () => clearInterval(bannerInterval.current);
    }
  }, [results]);

  // --- recommendations (once) ---
  useEffect(() => {
    fetch("https://api.jikan.moe/v4/recommendations/anime")
      .then((res) => res.json())
      .then((data) => {
        const unique = data.data
          .filter(
            (item, i, self) =>
              i ===
              self.findIndex((t) => t.entry[0].mal_id === item.entry[0].mal_id)
          )
          .slice(0, 10);
        setRecommended(unique);
      })
      .catch(console.error);
  }, []);

  const handleCardClick = (id) => navigate(`/anime/${id}`);
  const topBanners = recommended;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        p: 4,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Navigation Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
            Myanime
          </Typography>

          {/* Filters */}
          <FilterBar filters={filters} onChange={setFilters} />

          {/* Search */}
          <Box sx={{ flexBasis: { xs: "100%", sm: "auto" }, minWidth: 250 }}>
            <TextField
              label="Search Anime"
              variant="outlined"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ bgcolor: "black" }}
            />
          </Box>
        </Box>

        {/* Top Banner Carousel */}
        {topBanners.length > 0 && (
          <BannerCarousel
            banners={recommended}
            currentBanner={currentBanner}
            onCardClick={handleCardClick}
          />
        )}

        {/* Anime Grid */}
        <AnimeGrid
          results={results}
          loading={loading}
          onCardClick={handleCardClick}
        />

        {/* Pagination */}
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
          />
        </Box>
      </Box>
    </Box>
  );
}
