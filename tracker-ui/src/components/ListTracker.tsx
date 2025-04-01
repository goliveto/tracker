import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  TablePagination,
  Button,
  Stack,
  Skeleton,
  Container,
  Select,
  MenuItem
} from '@mui/material';

import { 
  Edit as EditIcon, 
} from '@mui/icons-material';
import { JobApplication, STATUS_ENUM } from '../model/Interfaces';
import { useRequestAPIHooks } from '../api/requestApiHook'; 
import MainNavigation from './MainNavigation';
import { useNavigate } from 'react-router';


export const ListTracker: React.FC = () => {
  // State management
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { getApplicationJobs, updateApplicationStatus } = useRequestAPIHooks();
  
  // Fetch applications effect
  useEffect(() => {
    
    setLoading(true);
    const response = getApplicationJobs(page,rowsPerPage);
    
    response.then(response=> {setApplications(response?.items??[]);
            setTotalCount(response?.totalCount??0);
    }) 
            .catch (error => console.error('Failed to fetch applications', error))
            .finally ( () => setLoading(false));
  
  }, [page, rowsPerPage]);

  // Pagination handlers
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null, 
    newPage: number
  ) => {
    setPage(newPage);
  };
  const navigate = useNavigate();

  const openJobAction = (id :number) => {
    navigate(`/trackers/${id}`);
  }

  const handleChange = (id:number, newStatus:string)=> {
    updateApplicationStatus(id,{status:newStatus.toString()})
    .then( () => {
      
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === id ? { ...app, status: parseInt(newStatus) } : app ));
    }
    );
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value,10));
    setPage(0);
  };

  // Render loading skeleton
  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        {[...Array(5)].map((_, index) => (
          <Skeleton 
            key={index} 
            variant="rectangular" 
            width="100%" 
            height={60} 
            sx={{ my: 1 }} 
          />
        ))}
      </Box>
    );
  }

  return (<>
    <MainNavigation/>
      <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Job Applications
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Applied</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.id}</TableCell>
                <TableCell>{application.position}</TableCell>
                <TableCell>{application.companyName}</TableCell>
                <TableCell>
                  <Select
                  id={`status_${application.id}`}
                  value={application.status}
                  onChange={(event)=>handleChange(application.id!,event.target.value)}
                  sx={{ width: 120, fontSize:14 }} >
                    {STATUS_ENUM.map(x=> <MenuItem key={`${x.id}`} value={x.id}>{x.description}</MenuItem>)}
                  </Select>
                </TableCell>
                <TableCell>
                  {new Date(application.dateApplied).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={()=>openJobAction(application.id!)}
                    >
                      Edit
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={totalCount} // Total number of items
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </Container>
    </>
  );
};

export default ListTracker;