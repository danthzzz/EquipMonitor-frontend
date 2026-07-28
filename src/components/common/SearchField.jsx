import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchField({ value, onChange, placeholder = 'Pesquisar...', sx = {} }) {
  return (
    <TextField
      size="small"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      sx={sx}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
    />
  );
}
