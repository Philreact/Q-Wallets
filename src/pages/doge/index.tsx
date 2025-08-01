import * as React from 'react';
import WalletContext from '../../contexts/walletContext';
import { epochToAgo, timeoutDelay, cropString } from '../../common/functions'
import { styled } from "@mui/system";
import { useTheme } from '@mui/material/styles';
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Slider,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Slide, { SlideProps } from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import QRCode from 'react-qr-code';
import {
  Close,
  CopyAllTwoTone,
  FirstPage,
  ImportContacts,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  PublishedWithChangesTwoTone,
  QrCode2,
  Refresh,
  Send
} from '@mui/icons-material';
import coinLogoDOGE from '../../assets/doge.png';
import { FeeManager } from '../../components/FeeManager';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
      </IconButton>
    </Box>
  );
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const DialogGeneral = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  "& .MuiDialog-paper": {
    borderRadius: "15px",
  },
}));

const DogeQrDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  "& .MuiDialog-paper": {
    borderRadius: "15px",
  },
}));

const DogeElectrumDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  "& .MuiDialog-paper": {
    borderRadius: "15px",
  },
}));

const DogeSubmittDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  "& .MuiDialog-paper": {
    borderRadius: "15px",
  },
}));

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
  },
});

const WalleteCard = styled(Card)({
  maxWidth: "100%",
  margin: "20px, auto",
  padding: "24px",
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
});

const CoinAvatar = styled(Avatar)({
  width: 120,
  height: 120,
  margin: "0 auto 16px",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const WalletButtons = styled(Button)({
  width: "auto",
  backgroundColor: "#05a2e4",
  color: "white",
  padding: "auto",
  "&:hover": {
    backgroundColor: "#02648d",
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#02648d',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const dogeMarks = [
  {
    value: 100,
    label: 'MIN',
  },
  {
    value: 1000,
    label: 'DEF',
  },
  {
    value: 10000,
    label: 'MAX',
  },
];

function valueTextDoge(value: number) {
  return `${value} SAT`;
}

export default function DogecoinWallet() {
  const { isAuthenticated } = React.useContext(WalletContext);

  if (!isAuthenticated) {
    return (
      <Alert variant="filled" severity="error">
        You must sign in, to use the Dogecoin wallet.
      </Alert>
    );
  }

  const [walletInfoDoge, setWalletInfoDoge] = React.useState<any>({});
  const [walletBalanceDoge, setWalletBalanceDoge] = React.useState<any>(null);
  const [isLoadingWalletBalanceDoge, setIsLoadingWalletBalanceDoge] = React.useState<boolean>(true);
  const [allElectrumServersDoge, setAllElectrumServersDoge] = React.useState<any>([]);
  const [currentElectrumServerDoge, setCurrentElectrumServerDoge] = React.useState<any>([]);
  const [allWalletAddressesDoge, setAllWalletAddressesDoge] = React.useState<any>([]);
  const [transactionsDoge, setTransactionsDoge] = React.useState<any>([]);
  const [isLoadingDogeTransactions, setIsLoadingDogeTransactions] = React.useState<boolean>(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [copyDogeAddress, setCopyDogeAddress] = React.useState('');
  const [copyDogeTxHash, setCopyDogeTxHash] = React.useState('');
  const [openDogeQR, setOpenDogeQR] = React.useState(false);
  const [openDogeElectrum, setOpenDogeElectrum] = React.useState(false);
  const [openDogeSend, setOpenDogeSend] = React.useState(false);
  const [dogeAmount, setDogeAmount] = React.useState<number>(0);
  const [dogeRecipient, setDogeRecipient] = React.useState('');
  const [loadingRefreshDoge, setLoadingRefreshDoge] = React.useState(false);
  const [openTxDogeSubmit, setOpenTxDogeSubmit] = React.useState(false);
  const [openSendDogeSuccess, setOpenSendDogeSuccess] = React.useState(false);
  const [openSendDogeError, setOpenSendDogeError] = React.useState(false);
  const [openDogeAddressBook, setOpenDogeAddressBook] = React.useState(false);

    const [inputFee, setInputFee] = React.useState(0)
   
   const dogeFeeCalculated = +(+inputFee / 1000 / 1e8).toFixed(8)
   const estimatedFeeCalculated = +dogeFeeCalculated * 5000

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transactionsDoge.length) : 0;

  const handleOpenDogeQR = () => {
    setOpenDogeQR(true);
  }

  const handleCloseDogeQR = () => {
    setOpenDogeQR(false);
  }

  const handleCloseDogeElectrum = () => {
    setOpenDogeElectrum(false);
  }

  const handleOpenAddressBook = async () => {
    setOpenDogeAddressBook(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOpenDogeAddressBook(false);
  }

  const handleOpenDogeSend = () => {
    setDogeAmount(0);
    setDogeRecipient('');
    setOpenDogeSend(true);
  }

  const validateCanSendDoge = () => {
    if (dogeAmount <= 0 || null || !dogeAmount) {
      return true;
    }
    if (dogeRecipient.length < 34 || '') {
      return true;
    }
    return false;
  }

  const handleCloseDogeSend = () => {
    setDogeAmount(0);
    setOpenDogeSend(false);
  }

  const changeCopyDogeStatus = async () => {
    setCopyDogeAddress('Copied');
    await timeoutDelay(2000);
    setCopyDogeAddress('');
  }

  const changeCopyDogeTxHash = async () => {
    setCopyDogeTxHash('Copied');
    await timeoutDelay(2000);
    setCopyDogeTxHash('');
  }

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number,) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  const handleCloseSendDogeSuccess = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSendDogeSuccess(false);
  };

  const handleCloseSendDogeError = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSendDogeError(false);
  };

  const getWalletInfoDoge = async () => {
    try {
      const response = await qortalRequest({
        action: "GET_USER_WALLET",
        coin: "DOGE"
      });
      if (!response?.error) {
        setWalletInfoDoge(response);
      }
    } catch (error) {
      setWalletInfoDoge({});
      console.error("ERROR GET DOGE WALLET INFO", error);
    }
  }

  React.useEffect(() => {
    if (!isAuthenticated) return;
    getWalletInfoDoge();
  }, [isAuthenticated]);

  const getWalletBalanceDoge = async () => {
    try {
      const response = await qortalRequestWithTimeout({
        action: "GET_WALLET_BALANCE",
        coin: 'DOGE'
      }, 300000);
      if (!response?.error) {
        setWalletBalanceDoge(response);
        setIsLoadingWalletBalanceDoge(false);
      }
    } catch (error) {
      setWalletBalanceDoge(null);
      setIsLoadingWalletBalanceDoge(false);
      console.error("ERROR GET DOGE BALANCE", error);
    }
  }

  React.useEffect(() => {
    if (!isAuthenticated) return;
    const intervalGetWalletBalanceDoge = setInterval(() => {
      getWalletBalanceDoge();
    }, 180000);
    getWalletBalanceDoge();
    return () => {
      clearInterval(intervalGetWalletBalanceDoge);
    }
  }, [isAuthenticated]);

  const getElectrumServersDoge = async () => {
    try {
      const response = await qortalRequest({
        action: "GET_CROSSCHAIN_SERVER_INFO",
        coin: "DOGE"
      });
      if (!response?.error) {
        setAllElectrumServersDoge(response);
        let currentDogeServer = response.filter(function (item: { isCurrent: boolean; }) {
          return item.isCurrent === true;
        });
        setCurrentElectrumServerDoge(currentDogeServer);
      }
    } catch (error) {
      setAllElectrumServersDoge({});
      console.error("ERROR GET DOGE SERVERS INFO", error);
    }
  }

  React.useEffect(() => {
    if (!isAuthenticated) return;
    getElectrumServersDoge();
  }, [isAuthenticated]);

  const handleOpenDogeElectrum = async () => {
    await getElectrumServersDoge();
    setOpenDogeElectrum(true);
  }

  const getTransactionsDoge = async () => {
    try {
      setIsLoadingDogeTransactions(true);
      const responseDogeAllAddresses = await qortalRequestWithTimeout({
        action: "GET_USER_WALLET_INFO",
        coin: "DOGE",
      }, 120000);
      const responseDogeTransactions = await qortalRequestWithTimeout({
        action: "GET_USER_WALLET_TRANSACTIONS",
        coin: 'DOGE'
      }, 300000);
      try {
        await responseDogeAllAddresses;
        if (!responseDogeAllAddresses?.error) {
          setAllWalletAddressesDoge(responseDogeAllAddresses);
        }
      } catch (error) {
        setAllWalletAddressesDoge([]);
        console.error("ERROR GET DOGE ALL ADDRESSES", error);
      }
      await responseDogeTransactions;
      if (!responseDogeTransactions?.error) {
        setTransactionsDoge(responseDogeTransactions);
        setIsLoadingDogeTransactions(false);
      }
    } catch (error) {
      setIsLoadingDogeTransactions(false);
      setTransactionsDoge([]);
      console.error("ERROR GET DOGE TRANSACTIONS", error);
    }
  }

  React.useEffect(() => {
    if (!isAuthenticated) return;
    getTransactionsDoge();
  }, [isAuthenticated]);

  const handleLoadingRefreshDoge = async () => {
    setLoadingRefreshDoge(true);
    await getTransactionsDoge();
    setLoadingRefreshDoge(false);
  }

  const handleSendMaxDoge = () => {
    const maxDogeAmount = +walletBalanceDoge - estimatedFeeCalculated;
    if (maxDogeAmount <= 0) {
      setDogeAmount(0);
    } else {
      setDogeAmount(maxDogeAmount);
    }
  }

  const DogeQrDialogPage = () => {
    return (
      <DogeQrDialog
        onClose={handleCloseDogeQR}
        aria-labelledby="doge-qr-code"
        open={openDogeQR}
        keepMounted={false}
      >
        <DialogTitle sx={{ m: 0, p: 2, fontSize: '12px' }} id="doge-qr-code">
          Address : {walletInfoDoge?.address}
        </DialogTitle>
        <DialogContent dividers>
          <div style={{ height: "auto", margin: "0 auto", maxWidth: 256, width: "100%" }}>
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={walletInfoDoge?.address}
              viewBox={`0 0 256 256`}
              fgColor={'#393939'}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDogeQR}>
            CLOSE
          </Button>
        </DialogActions>
      </DogeQrDialog>
    );
  }

  const sendDogeRequest = async () => {
        if(!dogeFeeCalculated) return

    setOpenTxDogeSubmit(true);
    try {
      const sendRequest = await qortalRequest({
        action: "SEND_COIN",
        coin: "DOGE",
        recipient: dogeRecipient,
        amount: dogeAmount,
        fee: dogeFeeCalculated
      });
      if (!sendRequest?.error) {
        setDogeAmount(0);
        setDogeRecipient('');
        setOpenTxDogeSubmit(false);
        setOpenSendDogeSuccess(true);
        setIsLoadingWalletBalanceDoge(true);
        await timeoutDelay(3000);
        getWalletBalanceDoge();
      }
    } catch (error) {
      setDogeAmount(0);
      setDogeRecipient('');
      setOpenTxDogeSubmit(false);
      setOpenSendDogeError(true);
      setIsLoadingWalletBalanceDoge(true);
      await timeoutDelay(3000);
      getWalletBalanceDoge();
      console.error("ERROR SENDING DOGE", error);
    }
  }

  const DogeSendDialogPage = () => {
    return (
      <Dialog
        fullScreen
        open={openDogeSend}
        onClose={handleCloseDogeSend}
        slots={{ transition: Transition }}
      >
        <DogeSubmittDialog
          fullWidth={true}
          maxWidth='xs'
          open={openTxDogeSubmit}
        >
          <DialogContent>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{
                width: "100%",
                display: 'flex',
                justifyContent: 'center'
              }}>
                <CircularProgress color="success" size={64} />
              </div>
              <div style={{
                width: "100%",
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px'
              }}>
                <Typography variant="h6" sx={{ color: 'primary.main', fontStyle: 'italic', fontWeight: 700 }}>
                  Processing Transaction Please Wait...
                </Typography>
              </div>
            </Box>
          </DialogContent>
        </DogeSubmittDialog>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={openSendDogeSuccess}
          autoHideDuration={4000}
          slots={{ transition: SlideTransition }}
          onClose={handleCloseSendDogeSuccess}>
          <Alert
            onClose={handleCloseSendDogeSuccess}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Sent DOGE transaction was successful.
          </Alert>
        </Snackbar>
        <Snackbar open={openSendDogeError} autoHideDuration={4000} onClose={handleCloseSendDogeError}>
          <Alert
            onClose={handleCloseSendDogeError}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Something went wrong, please try again.
          </Alert>
        </Snackbar>
        <AppBar sx={{ position: 'static' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseDogeSend}
              aria-label="close"
            >
              <Close />
            </IconButton>
            <Avatar sx={{ width: 28, height: 28 }} alt="DOGE Logo" src={coinLogoDOGE} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1, display: { xs: 'none', sm: 'block', paddingLeft: '10px', paddingTop: '3px' }
              }}
            >
              Transfer DOGE
            </Typography>
            <Button
              disabled={validateCanSendDoge()}
              variant="contained"
              startIcon={<Send />}
              aria-label="send-doge"
              onClick={sendDogeRequest}
              sx={{ backgroundColor: "#05a2e4", color: "white", "&:hover": { backgroundColor: "#02648d", } }}
            >
              SEND
            </Button>
          </Toolbar>
        </AppBar>
        <div style={{
          width: "100%",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '20px'
        }}>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ color: 'primary.main', fontWeight: 700 }}
          >
            Available Balance:&nbsp;&nbsp;
          </Typography>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ color: 'text.primary', fontWeight: 700 }}
          >
            {isLoadingWalletBalanceDoge ? <Box sx={{ width: '175px' }}><LinearProgress /></Box> : walletBalanceDoge + " DOGE"}
          </Typography>
        </div>
        <div style={{
          width: "100%",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '20px'
        }}>
          <Typography
            variant="h5"
            align="center"
            sx={{ color: 'primary.main', fontWeight: 700 }}
          >
            Max Sendable:&nbsp;&nbsp;
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{ color: 'text.primary', fontWeight: 700 }}
          >
            {(() => {
              const newMaxDogeAmount = +walletBalanceDoge - estimatedFeeCalculated;
              if (newMaxDogeAmount < 0) {
                return Number(0.00000000) + " DOGE"
              } else {
                return newMaxDogeAmount + " DOGE"
              }
            })()}
          </Typography>
          <div style={{ marginInlineStart: '15px' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleSendMaxDoge}
              style={{ borderRadius: 50 }}
            >
              Send Max
            </Button>
          </div>
        </div>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px',
            flexDirection: 'column',
            '& .MuiTextField-root': { width: '50ch' },
          }}
        >
          <NumericFormat
            decimalScale={8}
            defaultValue={0}
            value={dogeAmount}
            allowNegative={false}
            customInput={TextField}
            valueIsNumericString
            variant="outlined"
            label="Amount (DOGE)"
            isAllowed={(values) => {
              const maxDogeCoin = +walletBalanceDoge - estimatedFeeCalculated;
              const { formattedValue, floatValue } = values;
              return formattedValue === "" || floatValue <= maxDogeCoin;
            }}
            onValueChange={(values) => {
              setDogeAmount(values.floatValue);
            }}
            required
          />
          <TextField
            required
            label="Receiver Address"
            id="doge-address"
            margin="normal"
            value={dogeRecipient}
            helperText="DOGE address should be 34 characters long."
            slotProps={{ htmlInput: { maxLength: 34, minLength: 34 } }}
            onChange={(e) => setDogeRecipient(e.target.value)}
          />
        </Box>
         <FeeManager coin='DOGE' onChange={setInputFee} />
      </Dialog>
    );
  }

  const tableLoader = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{
          width: "100%",
          display: 'flex',
          justifyContent: 'center'
        }}>
          <CircularProgress />
        </div>
        <div style={{
          width: "100%",
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px'
        }}>
          <Typography variant="h5" sx={{ color: 'primary.main', fontStyle: 'italic', fontWeight: 700 }}>
            Loading Transactions Please Wait...
          </Typography>
        </div>
      </Box>
    );
  }

  const transactionsTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table stickyHeader sx={{ width: '100%' }} aria-label="transactions table" >
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Sender</StyledTableCell>
              <StyledTableCell align="left">Receiver</StyledTableCell>
              <StyledTableCell align="left">TX Hash</StyledTableCell>
              <StyledTableCell align="left">Total Amount</StyledTableCell>
              <StyledTableCell align="left">Time</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? transactionsDoge.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : transactionsDoge
            )?.map((row: {
              inputs: { address: any; addressInWallet: boolean; }[];
              outputs: { address: any; addressInWallet: boolean; }[];
              txHash: string;
              totalAmount: any;
              timestamp: number;
            }, k: React.Key) => (
              <StyledTableRow key={k}>
                <StyledTableCell style={{ width: 'auto' }} align="left">
                  {(() => {
                    if (row?.totalAmount < 0) {
                      let meWasSenderOutputs = row?.outputs.filter(function (item: { addressInWallet: boolean; }) {
                        return item.addressInWallet === true;
                      });
                      if (meWasSenderOutputs[0]?.address) {
                        return <div style={{ color: '#05a2e4' }}>{meWasSenderOutputs[0]?.address}</div>;
                      } else {
                        let meWasSenderInputs = row?.inputs.filter(function (item: { addressInWallet: boolean; }) {
                          return item.addressInWallet === true;
                        });
                        return <div style={{ color: '#05a2e4' }}>{meWasSenderInputs[0]?.address}</div>;
                      }
                    } else {
                      let meWasNotSenderOutputs = row?.outputs.filter(function (item: { addressInWallet: boolean; }) {
                        return item.addressInWallet === false;
                      });
                      if (meWasNotSenderOutputs[0]?.address) {
                        return meWasNotSenderOutputs[0]?.address;
                      } else {
                        let meWasNotSenderInputs = row?.inputs.filter(function (item: { addressInWallet: boolean; }) {
                          return item.addressInWallet === false;
                        });
                        return meWasNotSenderInputs[0]?.address;
                      }
                    }
                  })()}
                </StyledTableCell>
                <StyledTableCell style={{ width: 'auto' }} align="left">
                  {(() => {
                    if (row?.totalAmount < 0) {
                      let meWasNotRecipientOutputs = row?.outputs.filter(function (item: { addressInWallet: boolean; }) {
                        return item.addressInWallet === false;
                      });
                      if (meWasNotRecipientOutputs[0]?.address) {
                        return meWasNotRecipientOutputs[0]?.address;
                      } else {
                        let meWasNotRecipientInputs = row?.inputs.filter(function (item: { addressInWallet: boolean; }) {
                          return item.addressInWallet === false;
                        });
                        return meWasNotRecipientInputs[0]?.address;
                      }
                    } else if (row?.totalAmount > 0) {
                      let meWasRecipientOutputs = row?.outputs.filter(function (item: { addressInWallet: boolean; }) {
                        return item.addressInWallet === true;
                      });
                      if (meWasRecipientOutputs[0]?.address) {
                        return <div style={{ color: '#05a2e4' }}>{meWasRecipientOutputs[0]?.address}</div>
                      } else {
                        let meWasRecipientInputs = row?.inputs.filter(function (item: { addressInWallet: boolean; }) {
                          return item.addressInWallet === true;
                        });
                        return <div style={{ color: '#05a2e4' }}>{meWasRecipientInputs[0]?.address}</div>
                      }
                    }
                  })()}
                </StyledTableCell>
                <StyledTableCell style={{ width: 'auto' }} align="left">
                  {cropString(row?.txHash)}
                  <CustomWidthTooltip placement="top" title={copyDogeTxHash ? copyDogeTxHash : "Copy Hash: " + row?.txHash}>
                    <IconButton aria-label="copy" size="small" onClick={() => { navigator.clipboard.writeText(row?.txHash), changeCopyDogeTxHash() }}>
                      <CopyAllTwoTone fontSize="small" />
                    </IconButton>
                  </CustomWidthTooltip>
                </StyledTableCell>
                <StyledTableCell style={{ width: 'auto' }} align="left">
                  {row?.totalAmount > 0 ?
                    <div style={{ color: '#66bb6a' }}>+{(Number(row?.totalAmount) / 1e8).toFixed(8)}</div> : <div style={{ color: '#f44336' }}>{(Number(row?.totalAmount) / 1e8).toFixed(8)}</div>
                  }
                </StyledTableCell>
                <StyledTableCell style={{ width: 'auto' }} align="left">
                  <CustomWidthTooltip placement="top" title={new Date(row?.timestamp).toLocaleString()}>
                    <div>{epochToAgo(row?.timestamp)}</div>
                  </CustomWidthTooltip>
                </StyledTableCell>
              </StyledTableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter sx={{ width: "100%" }}>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={5}
                count={transactionsDoge.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    );
  }

  const setNewCurrentDogeServer = async (typeServer: string, hostServer: string, portServer: number) => {
    try {
      const setServer = await qortalRequest({
        action: "SET_CURRENT_FOREIGN_SERVER",
        coin: "DOGE",
        type: typeServer,
        host: hostServer,
        port: portServer
      });
      if (!setServer?.error) {
        await getElectrumServersDoge();
        setOpenDogeElectrum(false);
        await getWalletBalanceDoge();
        await getTransactionsDoge();
      }
    } catch (error) {
      await getElectrumServersDoge();
      setOpenDogeElectrum(false);
      console.error("ERROR GET DOGE SERVERS INFO", error);
    }
  }

  const DogeElectrumDialogPage = () => {
    return (
      <DogeElectrumDialog
        onClose={handleCloseDogeQR}
        aria-labelledby="doge-electrum-servers"
        open={openDogeElectrum}
        keepMounted={false}
      >
        <DialogTitle sx={{ m: 0, p: 2, fontSize: '14px' }} id="doge-electrum-servers">
          Available Dogecoin Electrum Servers.
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{
            width: '100%',
            maxWidth: 500,
            position: 'relative',
            overflow: 'auto',
            maxHeight: 400
          }}>
            <List>
              {(
                allElectrumServersDoge
              )?.map((server: {
                connectionType: string;
                hostName: string;
                port: number;
              }, i: React.Key) => (
                <ListItemButton key={i} onClick={() => { setNewCurrentDogeServer(server?.connectionType, server?.hostName, server?.port) }}>
                  <ListItemText primary={server?.connectionType + "://" + server?.hostName + ':' + server?.port} key={i} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDogeElectrum}>
            CLOSE
          </Button>
        </DialogActions>
      </DogeElectrumDialog>
    );
  }

  const DogeAddressBookDialogPage = () => {
    return (
      <DialogGeneral
        aria-labelledby="btc-electrum-servers"
        open={openDogeAddressBook}
        keepMounted={false}
      >
        <DialogContent>
          <Typography
            variant="h5"
            align="center"
            sx={{ color: 'text.primary', fontWeight: 700 }}
          >
            Coming soon...
          </Typography>
        </DialogContent>
      </DialogGeneral>
    );
  }

  return (
    <Box sx={{ width: '100%', marginTop: "20px" }}>
      {DogeSendDialogPage()}
      {DogeQrDialogPage()}
      {DogeElectrumDialogPage()}
      {DogeAddressBookDialogPage()}
      <Typography gutterBottom variant="h5" sx={{ color: 'primary.main', fontStyle: 'italic', fontWeight: 700 }}>
        Dogecoin Wallet
      </Typography>
      <WalleteCard>
        <CoinAvatar
          src={coinLogoDOGE}
          alt="Coinlogo"
        />
        <div style={{
          width: "100%",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ color: 'primary.main', fontWeight: 700 }}
          >
            Balance:&nbsp;&nbsp;
          </Typography>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ color: 'text.primary', fontWeight: 700 }}
          >
            {walletBalanceDoge ? walletBalanceDoge + " DOGE" : <Box sx={{ width: '175px' }}><LinearProgress /></Box>}
          </Typography>
        </div>
        <div style={{
          width: "100%",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ color: 'primary.main', fontWeight: 700 }}
          >
            Address:&nbsp;&nbsp;
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ color: 'text.primary', fontWeight: 700 }}
          >
            {walletInfoDoge?.address}
          </Typography>
          <Tooltip placement="right" title={copyDogeAddress ? copyDogeAddress : "Copy Address"}>
            <IconButton aria-label="copy" size="small" onClick={() => { navigator.clipboard.writeText(walletInfoDoge?.address), changeCopyDogeStatus() }}>
              <CopyAllTwoTone fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
        <div style={{
          width: "100%",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ color: 'primary.main', fontWeight: 700 }}
          >
            Electrum Server:&nbsp;&nbsp;
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ color: 'text.primary', fontWeight: 700 }}
          >
            {currentElectrumServerDoge[0]?.hostName ? currentElectrumServerDoge[0]?.hostName + ":" + currentElectrumServerDoge[0]?.port : <Box sx={{ width: '175px' }}><LinearProgress /></Box>}
          </Typography>
          <Tooltip placement="right" title="Change Server">
            <IconButton aria-label="open-electrum" size="small" onClick={handleOpenDogeElectrum}>
              <PublishedWithChangesTwoTone fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
        <div style={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px',
          marginTop: '15px'
        }}>
          <WalletButtons
            loading={isLoadingWalletBalanceDoge}
            loadingPosition="start"
            variant="contained"
            startIcon={<Send style={{ marginBottom: '2px' }} />}
            aria-label="transfer"
            onClick={handleOpenDogeSend}
          >
            Transfer DOGE
          </WalletButtons>
          <WalletButtons
            variant="contained"
            startIcon={<QrCode2 style={{ marginBottom: '2px' }} />}
            aria-label="QRcode"
            onClick={handleOpenDogeQR}
          >
            Show QR Code
          </WalletButtons>
          <WalletButtons
            variant="contained"
            startIcon={<ImportContacts style={{ marginBottom: '2px' }} />}
            aria-label="book"
            onClick={handleOpenAddressBook}
          >
            Address Book
          </WalletButtons>
        </div>
        <div style={{
          width: "100%",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6" paddingTop={2} paddingBottom={2}>
            Transactions:
          </Typography>
          <Button
            size="small"
            onClick={handleLoadingRefreshDoge}
            loading={loadingRefreshDoge}
            loadingPosition="start"
            startIcon={<Refresh />}
            variant="outlined"
            style={{ borderRadius: 50 }}
          >
            Refresh
          </Button>
        </div>
        {isLoadingDogeTransactions ? tableLoader() : transactionsTable()}
      </WalleteCard>
    </Box>
  );
}
