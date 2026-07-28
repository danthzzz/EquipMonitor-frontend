import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from '../common/Loading';
import EmptyState from '../common/EmptyState';

const COLUMNS = 3;

export default function CustomerTable({ customers, loading, onView, onEdit, onDelete }) {
  return (
    <TableContainer sx={{ maxHeight: '70vh' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Empresa</TableCell>
            <TableCell>CNPJ</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <Loading rows={6} columns={COLUMNS} />
          ) : customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={COLUMNS} sx={{ border: 0 }}>
                <EmptyState title="Nenhum cliente encontrado" description="Cadastre um novo cliente para começar." />
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer._id} hover>
                <TableCell>{customer.empresa}</TableCell>
                <TableCell>{customer.cnpj}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Ver detalhes">
                    <IconButton size="small" onClick={() => onView(customer)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => onEdit(customer)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton size="small" color="error" onClick={() => onDelete(customer)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
