import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { 
  Save as SaveIcon, 
  Clear as ClearIcon 
} from '@mui/icons-material';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import MainNavigation from './MainNavigation';
import { useRequestAPIHooks } from '../api/requestApiHook';
import { JobApplication, STATUS_ENUM } from '../model/Interfaces';
import { useParams } from 'react-router';
import { LocalizationProvider,DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Interface for Job Application Form
interface JobApplicationFormValues {
  position: string;
  companyName: string;
  status: string;
  dateApplied: dayjs.Dayjs | null;
}

// Validation Schema
const validationSchema = Yup.object().shape({
  position: Yup.string()
    .required('Position is required'),
  companyName: Yup.string()
    .required('Company Name is required'),
  status: Yup.number()
     .required('Status is required'),
  dateApplied: Yup.date().required('Date Applied is required')

});

// Initial form values
const initialValues: JobApplicationFormValues = {
  position: '',
  companyName: '',
  status: "0", 
  dateApplied: null
};

export const Tracker: React.FC = () => {
  const { id } = useParams();
  const [application,setApplication] = useState<JobApplication|undefined>();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const isCreate :boolean = isNaN(Number(id));

  const {createApplicationJob,getApplicationJob, updateApplicationJob} = useRequestAPIHooks();

  useEffect(() => {
    if(id) {
      getApplicationJob(+id).then(jobApplication =>{
        const dateFormatted= dayjs(jobApplication?.dateApplied)?? null;
         setApplication({...jobApplication, dateApplied:dateFormatted})});
    }
  }, [id]);

  const handleChange = (event) => {
    setApplication({ ...application, status: parseInt(event.target.value) });
  };

  const displaySuccessMessage = (msg:string)=> {
    setSnackbarMessage(msg);
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  }
  const displayErrorMessage = () => {
    setSnackbarMessage('Failed to submit application. Please try again.');
      setSnackbarSeverity('error');
      console.log(error);
      setOpenSnackbar(true);
  }
  // Handle form submission
  const handleSubmit = async (
    values: JobApplicationFormValues, 
    { setSubmitting, resetForm }: FormikHelpers<JobApplicationFormValues>
  ) => {
      setSubmitting(true);
      
      if(isCreate) {
        await createApplicationJob(values).then(()=>displaySuccessMessage('Job Application submitted successfully!')).catch(()=>displayErrorMessage()).finally(()=>setSubmitting(false));
        resetForm();
      } else {
        await updateApplicationJob(parseInt(id!,10), values).then(()=>displaySuccessMessage('Job Application updated successfully!')).catch(()=>displayErrorMessage()).finally(()=>setSubmitting(false));
      }
  };

  // Handle snackbar close
  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
    <MainNavigation/>
    <Container >
      <Box sx={{ p: 10, mt: 10 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {id ? 'Update Application': 'Submit Job Application'}
        </Typography>
        <Formik
          initialValues={application||initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ 
            values, 
            errors, 
            touched, 
            handleChange, 
            handleBlur, 
            setFieldValue,
            isSubmitting 
          }) => (
            
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Form>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }} >
                  <TextField
                    fullWidth
                    id="position"
                    name="position"
                    label="Position"
                    value={values.position}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.position && Boolean(errors.position)}
                    helperText={touched.position && errors.position}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} >
                  <TextField
                    fullWidth
                    id="companyName"
                    name="companyName"
                    label="Company Name"
                    value={values.companyName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.companyName && Boolean(errors.companyName)}
                    helperText={touched.companyName && errors.companyName}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    select
                    id="status"
                    name="status"
                    label="Application Status"
                    value={values.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.status && Boolean(errors.status)}
                    helperText={touched.status && errors.status}
                  >
                    <MenuItem value={0}>Select Status</MenuItem>
                    {STATUS_ENUM.map(x=> <MenuItem value={x.id}>{x.description}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                <DatePicker
                  label="Date Applied"
                  value={values.dateApplied}
                  onChange={(newValue) => {
                    setFieldValue('dateApplied', newValue);
                  }}
                  slots={{
                    textField: (params) => (
                      <TextField
                        {...params}
                        fullWidth
                        id="dateApplied"
                        name="dateApplied"
                        error={touched.dateApplied && Boolean(errors.dateApplied)}
                        helperText={touched.dateApplied && errors.dateApplied}
                      />
                    ),
                  }}
                  format="DD/MM/YYYY"
                />
                </Grid>

                <Grid spacing={2} size={{ xs: 12}}>
                  <Box display="flex" justifyContent="space-between">
                    <Button
                      type="reset"
                      variant="outlined"
                      color="secondary"
                      startIcon={<ClearIcon />}
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </Box>
                </Grid>
                </Grid>
            </Form>
            </LocalizationProvider>
          )}
        </Formik>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
    </>
  );
};
export default Tracker;