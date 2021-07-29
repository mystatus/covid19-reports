import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  FormControlLabel,
  FormGroup,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Alert } from '@material-ui/lab';
import MuiPhoneNumber from 'material-ui-phone-number';
import React, {
  ChangeEvent,
  useState,
} from 'react';
import {
  ApiAccessRequest,
  ApiOrg,
} from '../../../models/api-response';
import {
  validateEmail,
  validatePhone,
} from '../../../utility/validation-utils';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import useStyles from './request-access-dialog.styles';
import { AccessRequestClient } from '../../../client/access-request.client';

export type RequestAccessDialogProps = DialogProps & {
  onClose: () => void;
  onComplete: (accessRequest: ApiAccessRequest) => void;
  org?: ApiOrg;
};

export const RequestAccessDialog = (props: RequestAccessDialogProps) => {
  const { open, onClose, onComplete, org } = props;
  const classes = useStyles();

  const initialInputData = {
    whatYouDoSelected: {} as { [key: string]: boolean },
    whatYouDoOtherText: '',
    sponsorName: '',
    sponsorEmail: '',
    sponsorPhone: '',
    justification: '',
  };

  const initialHelperText = {
    sponsorEmail: undefined as string | undefined,
    sponsorPhone: undefined as string | undefined,
  };

  const [inputData, setInputData] = useState(initialInputData);
  const [helperText, setHelperText] = useState(initialHelperText);
  const [activeStep, setActiveStep] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined as string | undefined);
  const [showError, setShowError] = useState(false);

  const whatYouDoOptions = [
    `I provide medical attention to members`,
    `I provide mental health counseling to members`,
    `I manage the roster`,
    `I manage muster compliance`,
    `I am responsible for rollup reporting`,
    `I grant access to new users and assign roles`,
    `Other`,
  ];

  const reset = () => {
    setInputData(initialInputData);
    setHelperText(initialHelperText);
    setActiveStep(0);
    setSubmitLoading(false);
  };

  const handleWhatYouDoOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const whatYouDoSelected = { ...inputData.whatYouDoSelected };

    // Toggle option.
    const index = parseInt(event.target.name);
    if (whatYouDoSelected[index]) {
      delete whatYouDoSelected[index];
    } else {
      whatYouDoSelected[index] = true;
    }

    setInputData({
      ...inputData,
      whatYouDoSelected,
    });
  };

  const isWhatYouDoOptionChecked = (index: number) => {
    return !!inputData.whatYouDoSelected[index];
  };

  const isOtherChecked = () => {
    const lastIndex = whatYouDoOptions.length - 1;
    return inputData.whatYouDoSelected[lastIndex];
  };

  const handleCancelClick = () => {
    setInputData(initialInputData);
    setHelperText(initialHelperText);
    onClose();
  };

  const handleNextClick = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBackClick = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmitClick = async () => {
    setSubmitLoading(true);

    // Get selected what you do text, and add Other text if it's set.
    const whatYouDo = whatYouDoOptions.slice(0, -1) // Trim 'Other' label item
      .filter((_, index) => inputData.whatYouDoSelected[index]);

    if (isOtherChecked()) {
      whatYouDo.push(inputData.whatYouDoOtherText);
    }

    // Send request.
    let newRequest: ApiAccessRequest;
    try {
      newRequest = await AccessRequestClient.issueAccessRequest(org!.id, {
        whatYouDo,
        sponsorName: inputData.sponsorName,
        sponsorEmail: inputData.sponsorEmail,
        sponsorPhone: inputData.sponsorPhone,
        justification: inputData.justification,
      });

      onComplete(newRequest);
      onClose();
    } catch (err) {
      handleError(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleError = (err: any) => {
    let message: string;
    if (err.data) {
      message = err.data.errors.map((x: any) => x.message).join('\n');
    } else {
      message = err.message;
    }

    setErrorMessage(message);
    setShowError(true);
  };

  //
  // Step Content
  //

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return getStep0Content();
      case 1:
        return getStep1Content();
      default:
        return 'Unknown step';
    }
  };

  const getStep0Content = () => {
    return (
      <>
        <Box component="p">
          <Typography component="span">Please tell us what you do for this group. Check all that apply.</Typography>
        </Box>

        <FormGroup className={classes.formGroup}>
          {whatYouDoOptions.map((text, index) => (
            <FormControlLabel
              key={index}
              label={text}
              control={(
                <Checkbox
                  checked={isWhatYouDoOptionChecked(index)}
                  onChange={handleWhatYouDoOptionChange}
                  name={`${index}`}
                />
              )}
            />
          ))}

          {isOtherChecked() && (
            <TextField
              placeholder="Please tell us what you do..."
              value={inputData.whatYouDoOtherText}
              onChange={event => setInputData({ ...inputData, whatYouDoOtherText: event.target.value })}
              required
            />
          )}
        </FormGroup>
      </>
    );
  };

  const handleEmailBlur = () => {
    setHelperText({
      ...helperText,
      sponsorEmail: (inputData.sponsorEmail && !validateEmail(inputData.sponsorEmail))
        ? 'Invalid email address'
        : undefined,
    });
  };

  const handlePhoneBlur = () => {
    setHelperText({
      ...helperText,
      sponsorPhone: (inputData.sponsorPhone && !validatePhone(inputData.sponsorPhone))
        ? 'Invalid phone number'
        : undefined,
    });
  };

  const getStep1Content = () => {
    return (
      <>
        <Box component="p">
          <Typography component="span">Who invited or asked you to join this group?</Typography>
        </Box>

        <FormGroup className={classes.formGroup}>
          <TextField
            label="Sponsor Name"
            value={inputData.sponsorName}
            onChange={event => setInputData({ ...inputData, sponsorName: event.target.value })}
            required
          />
          <TextField
            label="Sponsor Email"
            value={inputData.sponsorEmail}
            onChange={event => setInputData({ ...inputData, sponsorEmail: event.target.value })}
            onBlur={handleEmailBlur}
            helperText={helperText.sponsorEmail}
            required
          />
          <MuiPhoneNumber
            label="Sponsor Phone"
            onChange={(value: string) => setInputData({ ...inputData, sponsorPhone: value })}
            onBlur={handlePhoneBlur}
            helperText={helperText.sponsorPhone}
            placeholder=""
            onlyCountries={['us']}
            defaultCountry="us"
            disableCountryCode
            disableDropdown
            required
          />
          <TextField
            label="Reason why you need access to this group"
            value={inputData.justification}
            onChange={event => setInputData({ ...inputData, justification: event.target.value })}
            multiline
            rows={2}
            rowsMax={4}
            required
          />
        </FormGroup>
      </>
    );
  };

  //
  // Step Actions
  //

  const getStepActions = () => {
    switch (activeStep) {
      case 0:
        return getStep0Actions();
      case 1:
        return getStep1Actions();
      default:
        return 'Unknown step';
    }
  };

  const getStep0Actions = () => {
    let nextDisabled = false;
    const whatYouDoSelectedCount = Object.keys(inputData.whatYouDoSelected).length;
    if (whatYouDoSelectedCount === 0) {
      nextDisabled = true;
    } else if (isOtherChecked() && inputData.whatYouDoOtherText === '') {
      nextDisabled = true;
    }

    return (
      <>
        <Button
          key="next"
          color="primary"
          onClick={handleNextClick}
          disabled={nextDisabled}
          endIcon={<ArrowForwardIcon />}
        >
          Next
        </Button>
      </>
    );
  };

  const getStep1Actions = () => {
    const submitDisabled = (
      inputData.sponsorName.length === 0
      || !validateEmail(inputData.sponsorEmail)
      || !validatePhone(inputData.sponsorPhone)
      || inputData.justification.length === 0
    );

    return (
      <>
        <Button
          key="back"
          variant="outlined"
          color="primary"
          onClick={handleBackClick}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>

        <ButtonWithSpinner
          key="submit"
          color="primary"
          onClick={handleSubmitClick}
          disabled={submitDisabled}
          loading={submitLoading}
        >
          Submit Request
        </ButtonWithSpinner>
      </>
    );
  };

  if (!org) {
    return null;
  }

  return (
    <>
      <Dialog
        maxWidth="md"
        open={open}
        onClose={onClose}
        onExited={reset}
        disableBackdropClick
      >
        <DialogContent>
          <Box component="p" marginTop={0}>
            <Typography component="span">You are requesting access to the <strong>{org.name}</strong> group.</Typography>
          </Box>

          {getStepContent()}
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCancelClick}
          >
            Cancel
          </Button>

          <Box flex={1} />

          {getStepActions()}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showError}
        onClose={() => setShowError(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
