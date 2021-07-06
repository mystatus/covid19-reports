import {
  Box,
  FormGroup,
  Icon,
  MenuItem,
  Paper,
  TextField,
} from '@material-ui/core';
import {
  AssignmentOutlined,
  DoneAll,
  FavoriteBorder,
  LocalHospital,
  Timeline,
} from '@material-ui/icons';
import MuiPhoneNumber from 'material-ui-phone-number';
import React, { useState } from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  User,
  UserRegisterData,
} from '../../../actions/user.actions';
import services from '../../../data/services';
import { UserState } from '../../../reducers/user.reducer';
import { AppState } from '../../../store';
import {
  validateEmail,
  validatePhone,
} from '../../../utility/validation-utils';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { Link } from '../../link/link';
import useStyles from './user-registration-page.styles';

type UserRegisterDataWithValidation = {
  [key in keyof UserRegisterData]: {
    hasBlurred: boolean;
    hasChanged: boolean;
    helperText: string;
    value: string;
  };
};

export const UserRegistrationPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector<AppState, UserState>(state => state.user);
  const [registerUserLoading, setRegisterUserLoading] = useState(false);
  const [inputData, setInputData] = useState<UserRegisterDataWithValidation>({
    firstName: { hasBlurred: false, hasChanged: false, helperText: '', value: '' },
    lastName: { hasBlurred: false, hasChanged: false, helperText: '', value: '' },
    phone: { hasBlurred: false, hasChanged: false, helperText: '', value: '' },
    service: { hasBlurred: false, hasChanged: false, helperText: '', value: '' },
    email: { hasBlurred: false, hasChanged: false, helperText: '', value: '' },
  });

  function getInputValidation(key: keyof UserRegisterData) {
    const { hasBlurred, hasChanged, helperText } = inputData[key] ?? {};
    if (helperText && hasBlurred && hasChanged) {
      return {
        error: true,
        helperText,
      };
    }
    return null;
  }

  function handleValidation(key: keyof UserRegisterData, value: string, fromBlur = true) {
    let helperText = '';
    if (value) {
      if (key === 'email' && !validateEmail(value)) {
        helperText = 'Invalid email address';
      } else if (key === 'phone' && !validatePhone(value)) {
        helperText = 'Invalid phone number';
      }
    }
    inputData[key] = {
      hasBlurred: inputData[key].hasBlurred || fromBlur,
      hasChanged: inputData[key].hasChanged || !fromBlur,
      helperText,
      value,
    };
    setInputData({ ...inputData });
  }

  function handleChange(key: keyof UserRegisterData, value: string) {
    setInputData({
      ...inputData,
      [key]: value,
    });
    handleValidation(key, value, false);
  }

  function handleInputChange(key: keyof UserRegisterData, e: React.ChangeEvent<{ value: unknown }>) {
    handleChange(key, e.target.value as string);
  }

  async function handleCreateAccountClick() {
    setRegisterUserLoading(true);
    await dispatch(User.register({
      firstName: inputData.firstName.value,
      lastName: inputData.lastName.value,
      phone: inputData.phone.value,
      service: inputData.service.value,
      email: inputData.email.value,
    }));
    setRegisterUserLoading(false);
  }

  function isCreateAccountButtonDisabled() {
    return (
      !inputData.firstName
      || !inputData.lastName
      || !inputData.phone
      || !validatePhone(inputData.phone.value)
      || !inputData.service
      || !inputData.email
      || !validateEmail(inputData.email.value)
    );
  }

  return (
    <main className={classes.root}>
      <Paper className={classes.content}>
        <div className={classes.contentLeft}>
          <ul>
            <li>
              <Icon component={AssignmentOutlined} />
              Receive daily reports
            </li>
            <li>
              <Icon component={DoneAll} />
              Track symptom check compliance
            </li>
            <li>
              <Icon component={FavoriteBorder} />
              Monitor force health & wellness
            </li>
            <li>
              <Icon component={Timeline} />
              View and track trending data
            </li>
            <li>
              <Icon component={LocalHospital} />
              Monitor personnel mental health
            </li>
          </ul>
        </div>

        <div className={classes.contentRight}>
          <header className={classes.welcomeHeader}>
            <div>Welcome to Status Engine!</div>
            <p>
              Please take a moment to create your account. Once you have created an account you will be able to request
              access to your group. If you have any questions about the onboarding process please visit this
              <Link target="_blank" rel="noopener noreferrer" href="/onboarding-doc"> page</Link> for more information.
            </p>
          </header>

          <FormGroup className={classes.form}>
            <Box>
              <TextField
                id="firstName"
                label="First name"
                required
                onBlur={e => handleValidation('firstName', e.target.value)}
                onChange={e => handleInputChange('firstName', e)}
                {...getInputValidation('firstName')}
              />
              <TextField
                id="lastName"
                label="Last name"
                required
                onBlur={e => handleValidation('lastName', e.target.value)}
                onChange={e => handleInputChange('lastName', e)}
                {...getInputValidation('lastName')}
              />
            </Box>
            <Box>
              <TextField
                id="edipi"
                label="DoD ID"
                value={user.edipi}
                required
                disabled
              />
              <MuiPhoneNumber
                onlyCountries={['us']}
                defaultCountry="us"
                disableCountryCode
                disableDropdown
                id="phone"
                label="Phone number"
                onBlur={(e: any) => handleValidation('phone', e.nativeEvent.target.value)}
                onChange={(value: string) => handleChange('phone', value)}
                placeholder=""
                required
                {...getInputValidation('phone')}
              />
            </Box>
            <Box>
              <TextField
                id="service"
                label="Service"
                select
                value={inputData.service.value}
                required
                onBlur={e => handleValidation('service', e.target.value)}
                onChange={e => handleInputChange('service', e)}
                {...getInputValidation('service')}
              >
                {services.map(serviceName => (
                  <MenuItem key={serviceName} value={serviceName}>
                    {serviceName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="email"
                label="Email"
                type="email"
                required
                onBlur={e => handleValidation('email', e.target.value)}
                onChange={e => handleInputChange('email', e)}
                {...getInputValidation('email')}
              />
            </Box>
          </FormGroup>

          <ButtonWithSpinner
            className={classes.createAccountButton}
            size="large"
            onClick={handleCreateAccountClick}
            disabled={isCreateAccountButtonDisabled()}
            loading={registerUserLoading}
          >
            Create Account
          </ButtonWithSpinner>
        </div>
      </Paper>
    </main>
  );
};
