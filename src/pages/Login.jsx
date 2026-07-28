import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context";
import api from '../services/api';
import img from '../assets/mgs.png';

import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
  Stack,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { setUserData } = useUserContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await api.post('/users/login', { username, password });
      if (res.data.Status === "Success") {
        localStorage.setItem("userData", JSON.stringify(res.data));
        setUserData(res.data);
        navigate('/home');
      } else {
        setError("Usuário ou senha inválidos.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 900,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              bgcolor: '#000000',
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
            }}
          >
            <img
              src={img}
              alt="Logo"
              style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}
            >
              <Typography variant="h4" component="h1" fontWeight="bold" align="center" gutterBottom mb={4}>
                LOGIN
              </Typography>

              <Stack spacing={3}>
                <TextField
                  label="Usuário"
                  variant="outlined"
                  fullWidth
                  placeholder="Insira o usuário"
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                <TextField
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  placeholder="Insira a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {error && <Alert severity="error">{error}</Alert>}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={submitting}
                  sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
                >
                  {submitting ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
