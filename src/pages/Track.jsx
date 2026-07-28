import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { FindInPage } from '@mui/icons-material';
import MainLayout from "../layouts/MainLayout";

const CERTIFICATES = [
  {
    nome: 'CONJUNTO DE BLOCOS',
    dataCadastro: '12/12/2022',
    ultimaAtualizacao: '26/05/2023',
    url: 'https://mgstec-my.sharepoint.com/personal/max_azevedo_pruftechnik_com_br/_layouts/15/onedrive.aspx?ga=1&id=%2Fpersonal%2Fmax%5Fazevedo%5Fpruftechnik%5Fcom%5Fbr%2FDocuments%2FLaboratorio%2FCalibra%C3%A7oes%2F2023%2FCERTIFICADOS%20PRUF%2FCONJUNTO%20DE%20BLOCOS%2Epdf&parent=%2Fpersonal%2Fmax%5Fazevedo%5Fpruftechnik%5Fcom%5Fbr%2FDocuments%2FLaboratorio%2FCalibra%C3%A7oes%2F2023%2FCERTIFICADOS%20PRUF',
  },
  {
    nome: 'CONJUNTO DE BLOCOS',
    dataCadastro: '12/12/2022',
    ultimaAtualizacao: '26/05/2023',
    url: 'https://mgstec-my.sharepoint.com/personal/max_azevedo_pruftechnik_com_br/_layouts/15/onedrive.aspx?ga=1&id=%2Fpersonal%2Fmax%5Fazevedo%5Fpruftechnik%5Fcom%5Fbr%2FDocuments%2FLaboratorio%2FCalibra%C3%A7oes%2F2023%2FCERTIFICADOS%20PRUF%2FCONJUNTO%20DE%20BLOCOS%202%2Epdf&parent=%2Fpersonal%2Fmax%5Fazevedo%5Fpruftechnik%5Fcom%5Fbr%2FDocuments%2FLaboratorio%2FCalibra%C3%A7oes%2F2023%2FCERTIFICADOS%20PRUF',
  },
  {
    nome: 'CONJUNTO DE BLOCOS',
    dataCadastro: '12/12/2022',
    ultimaAtualizacao: '26/05/2023',
    url: 'https://mgstec-my.sharepoint.com/personal/max_azevedo_pruftechnik_com_br/_layouts/15/onedrive.aspx?ga=1&id=%2Fpersonal%2Fmax%5Fazevedo%5Fpruftechnik%5Fcom%5Fbr%2FDocuments%2FLaboratorio%2FCalibra%C3%A7oes%2F2023%2FCERTIFICADOS%20PRUF%2FCONJUNTO%20DE%20BLOCOS%203%2Epdf&parent=%2Fpersonal%2Fmax%5Fazevedo%5Fpruftechnik%5Fcom%5Fbr%2FDocuments%2FLaboratorio%2FCalibra%C3%A7oes%2F2023%2FCERTIFICADOS%20PRUF',
  },
  {
    nome: 'CONJUNTO DE BLOCOS',
    dataCadastro: '12/12/2022',
    ultimaAtualizacao: '26/05/2023',
    url: 'https://mgstec-my.sharepoint.com/personal/max_azevedo_pruftechnik_com_br/_layouts/15/onedrive.aspx?ga=1&id=%2Fpersonal%2Fmax%5Fazevedo%5Fpruftechnik%5Fcom%5Fbr%2FDocuments%2FLaboratorio%2FCalibra%C3%A7oes%2F2023%2FCERTIFICADOS%20PRUF%2FCONJUNTO%20DE%20BLOCOS%204%2Epdf&parent=%2Fpersonal%2Fmax%5Fazevedo%5Fpruftechnik%5Fcom%5Fbr%2FDocuments%2FLaboratorio%2FCalibra%C3%A7oes%2F2023%2FCERTIFICADOS%20PRUF',
  },
  {
    nome: 'CONJUNTO DE BLOCOS',
    dataCadastro: '12/12/2022',
    ultimaAtualizacao: '26/05/2023',
    url: 'https://mgstec-my.sharepoint.com/personal/max_azevedo_pruftechnik_com_br/_layouts/15/onedrive.aspx?ga=1&id=%2Fpersonal%2Fmax%5Fazevedo%5Fpruftechnik%5Fcom%5Fbr%2FDocuments%2FLaboratorio%2FCalibra%C3%A7oes%2F2023%2FCERTIFICADOS%20PRUF%2FCONJUNTO%20DE%20BLOCOS%205%2Epdf&parent=%2Fpersonal%2Fmax%5Fazevedo%5Fpruftechnik%5Fcom%5Fbr%2FDocuments%2FLaboratorio%2FCalibra%C3%A7oes%2F2023%2FCERTIFICADOS%20PRUF',
  },
  {
    nome: 'CONJUNTO DE BLOCOS',
    dataCadastro: '12/12/2022',
    ultimaAtualizacao: '26/05/2023',
    url: 'https://mgstec-my.sharepoint.com/personal/max_azevedo_pruftechnik_com_br/_layouts/15/onedrive.aspx?ga=1&id=%2Fpersonal%2Fmax%5Fazevedo%5Fpruftechnik%5Fcom%5Fbr%2FDocuments%2FLaboratorio%2FCalibra%C3%A7oes%2F2023%2FCERTIFICADOS%20PRUF%2FCONJUNTO%20DE%20BLOCOS%206%2Epdf&parent=%2Fpersonal%2Fmax%5Fazevedo%5Fpruftechnik%5Fcom%5Fbr%2FDocuments%2FLaboratorio%2FCalibra%C3%A7oes%2F2023%2FCERTIFICADOS%20PRUF',
  },
  {
    nome: 'CALIBRADOR DE ACELEROMETRO',
    dataCadastro: '08/12/2022',
    ultimaAtualizacao: '26/05/2023',
    url: 'https://mgstec-my.sharepoint.com/personal/max_azevedo_pruftechnik_com_br/_layouts/15/onedrive.aspx?ga=1&id=%2Fpersonal%2Fmax%5Fazevedo%5Fpruftechnik%5Fcom%5Fbr%2FDocuments%2FLaboratorio%2FCalibra%C3%A7oes%2F2023%2FCERTIFICADOS%20PRUF%2FCALIBRADOR%20DE%20ACELEROMETRO%2Epdf&parent=%2Fpersonal%2Fmax%5Fazevedo%5Fpruftechnik%5Fcom%5Fbr%2FDocuments%2FLaboratorio%2FCalibra%C3%A7oes%2F2023%2FCERTIFICADOS%20PRUF',
  },
];

export default function Track() {
  const navigate = useNavigate();
  const [currentUser] = useState(() => {
    const storedUserData = localStorage.getItem("userData");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  useEffect(() => {
    if (currentUser === null) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (currentUser === null) return null;

  return (
    <MainLayout>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={4} flexWrap="wrap" useFlexGap justifyContent="center">
          <Typography><strong>{currentUser.cliente}</strong></Typography>
          <Typography><strong>{currentUser.endereço}</strong></Typography>
          <Typography>Responsável: <strong>{currentUser.responsavel}</strong></Typography>
        </Stack>
      </Paper>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Data de Cadastro</TableCell>
                <TableCell>Última Atualização</TableCell>
                <TableCell align="right">Certificado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CERTIFICATES.map((cert, index) => (
                <TableRow key={index} hover>
                  <TableCell>{cert.nome}</TableCell>
                  <TableCell>{cert.dataCadastro}</TableCell>
                  <TableCell>{cert.ultimaAtualizacao}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Abrir certificado">
                      <IconButton component="a" href={cert.url} target="_blank" rel="noopener noreferrer">
                        <FindInPage />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </MainLayout>
  );
}
