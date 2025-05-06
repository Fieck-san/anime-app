// src/components/FilterBar.jsx
import React from "react";
import {
  Box,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

export default function FilterBar({ filters, onChange }) {
  const update = (key, value) =>
    onChange({ ...filters, [key]: value });

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {/* Type */}
      <TextField
        select label="Type" size="small"
        value={filters.type}
        onChange={e => update("type", e.target.value)}
        sx={{ minWidth: 200 }}
        SelectProps={{
          displayEmpty: true,
          renderValue: sel => sel?.toUpperCase() || "",
        }}
        InputProps={{
          endAdornment: filters.type && (
            <InputAdornment position="start">
              <IconButton
                size="small"
                onClick={() => update("type", "")}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      >
        {["tv","movie","ova","special","ona","music","cm","pv","tv special"]
          .map(t => (
            <MenuItem key={t} value={t}>{t.toUpperCase()}</MenuItem>
        ))}
      </TextField>

      {/* Top Filter */}
      <TextField
        select label="Filter" size="small"
        value={filters.filter}
        onChange={e => update("filter", e.target.value)}
        sx={{ minWidth: 200 }}
        SelectProps={{
          displayEmpty: true,
          renderValue: sel => sel || "",
        }}
        InputProps={{
          endAdornment: filters.filter && (
            <InputAdornment position="start">
              <IconButton
                size="small"
                onClick={() => update("filter", "")}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      >
        {["Airing","Upcoming","By Popularity","Favorite"].map(flt => (
          <MenuItem key={flt} value={flt}>{flt}</MenuItem>
        ))}
      </TextField>

      {/* Rating */}
      <TextField
        select label="Rating" size="small"
        value={filters.rating}
        onChange={e => update("rating", e.target.value)}
        sx={{ minWidth: 200 }}
        SelectProps={{
          displayEmpty: true,
          renderValue: sel => sel?.toUpperCase() || "",
        }}
        InputProps={{
          endAdornment: filters.rating && (
            <InputAdornment position="start">
              <IconButton
                size="small"
                onClick={() => update("rating", "")}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      >
        {["g","pg","pg13","r17"].map(r => (
          <MenuItem key={r} value={r}>{r.toUpperCase()}</MenuItem>
        ))}
      </TextField>

      {/* SFW */}
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.sfw}
            onChange={e => update("sfw", e.target.checked)}
          />
        }
        label="SFW Only"
      />
    </Box>
  );
}
