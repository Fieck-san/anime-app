import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
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
} from '@mui/material';

export default function SearchPage() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [currentBanner, setCurrentBanner] = useState(0);
  const navigate = useNavigate();
  const bannerInterval = useRef(null);

  const fetchAnime = (query, pageNum) => {
    setLoading(true);
    const url = query
      ? `https://api.jikan.moe/v4/anime?q=${query}&page=${pageNum}`
      : `https://api.jikan.moe/v4/top/anime?page=${pageNum}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.data.slice(0, 21));
        setPageCount(data.pagination.last_visible_page);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const debouncedSearch = debounce((value, pageNum) => {
    fetchAnime(value, pageNum);
  }, 250);

  useEffect(() => {
    debouncedSearch(search, page);
  }, [search, page]);

  useEffect(() => {
    if (results.length > 0) {
      bannerInterval.current = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % Math.min(results.length, 5));
      }, 4000);
      return () => clearInterval(bannerInterval.current);
    }
  }, [results]);

  const handleCardClick = (id) => navigate(`/anime/${id}`);
  const topBanners = results.slice(0, 5);

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
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        <TextField
          label="Search Anime"
          variant="outlined"
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 4 }}
        />

        {/* Top Banner Carousel */}
        {/* {topBanners.length > 0 && (
          <Box sx={{ position: 'relative', overflow: 'hidden', height: 250, mb: 4, borderRadius: 2 }}>
            <Box
              sx={{
                display: 'flex',
                transition: 'transform 0.6s ease-in-out',
                transform: `translateX(-${currentBanner * 100}%)`,
                width: `${topBanners.length * 100}%`,
              }}
            >
              {topBanners.map((anime) => (
                <Box
                  key={anime.mal_id}
                  sx={{
                    flex: '0 0 100%',
                    height: 250,
                    backgroundImage: `url(${anime.images.jpg.large_image_url})`,
                    backgroundSize: 'auto',
                    // backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleCardClick(anime.mal_id)}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      bgcolor: 'rgba(0,0,0,0.6)',
                      p: 2,
                    }}
                  >
                    <Typography variant="h6" color="white">
                      {anime.title}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Dot Indicators */}
            {/* <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              {topBanners.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: currentBanner === idx ? 'primary.main' : 'grey.500',
                    transition: 'background-color 0.3s',
                  }}
                />
              ))}
            </Box>
          </Box>
        )} } */}

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
        ) : results.length === 0 ? (
          <Box mt={4} textAlign="center">
            No results found.
          </Box>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {results.map((anime) => (
              <Grid item xs={12} sm={6} md={3} key={anime.mal_id}>
                <Card
                  sx={{
                    width: 225,
                    height: 500,
                    backgroundColor: 'background.paper',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      cursor: 'pointer',
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleCardClick(anime.mal_id)}>
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
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                    <CardContent>
                      <Box
                        sx={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          mb: 1,
                          color: 'white',
                        }}
                      >
                        {anime.title}
                      </Box>
                      <Box sx={{ fontSize: '0.9rem' }}>
                        Episodes: {anime.episodes ?? 'N/A'}
                      </Box>
                      <Box sx={{ fontSize: '0.9rem' }}>
                        Status: {anime.status}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Box>
    </Box>
  );
}
