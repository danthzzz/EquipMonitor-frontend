import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function DashboardFilters({ availableYears, selectedYear, onYearChange }) {
  return (
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <InputLabel>Ano</InputLabel>
      <Select value={selectedYear} label="Ano" onChange={(e) => onYearChange(e.target.value)}>
        {availableYears.map((year) => (
          <MenuItem key={year} value={year}>{year}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
