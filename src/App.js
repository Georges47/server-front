import {useEffect, useMemo, useState} from "react";
import {
  AppBar,
  Box,
  Button,
  createTheme, CssBaseline, LinearProgress,
  Paper,
  Switch,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography
} from "@mui/material";
import { LightMode, DarkMode } from '@mui/icons-material';

const baseUrl = `http://${process.env.REACT_APP_HOST}:8080`;

function App({cableApp}) {
  // const [downloadUrl, setDownloadUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [downloadMessages, setDownloadMessages] = useState([""]);
  const [filename, setFilename] = useState("");
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPercentage, setProcessingPercentage] = useState(0);

  const [paletteMode, setPaletteMode] = useState("light");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: paletteMode,
        },
      }),
    [paletteMode]
  );

  useEffect(() => {
    cableApp.cable.subscriptions.create({ channel: 'YoutubeDlChannel', name: 'youtube_dl_channel' },
      {
        received: (message) => {
          if(message.includes("[link]")) {
            setIsProcessing(false);
            setShowDownloadButton(true);
          } else {
            console.log(parseFloat(message))
            if(!isNaN(message)) setProcessingPercentage(parseFloat(message));
            setDownloadMessages(downloadMessages => [...downloadMessages, message]);
          }
        }
      })
    console.log(cableApp);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box style={{height: "100%"}}>
        <AppBar position="static" style={{marginBottom: 20}}>
          <Toolbar>
            <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
              <LightMode />
              <Switch color="default" onChange={() => paletteMode === "light" ? setPaletteMode("dark") : setPaletteMode("light")}/>
              <DarkMode />
            </Box>
          </Toolbar>
        </AppBar>
        <Box style={{display: "flex", justifyContent: "center"}}>
            <Paper style={{padding: 0, display: "flex", flexDirection: "column"}}>
              <Box style={{
                padding: 5,
                margin: 20,
              }}>
                {
                  !downloadMessages[downloadMessages.length - 1].includes("[link]") &&
                  <Box>
                    <Typography style={{color: "#1976d2"}}> Ingresa el link del video </Typography>
                    <Box style={{
                      border: "1px #1976d2 solid",
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                    }}>
                      <TextField
                        variant="standard"
                        required
                        value={videoUrl}
                        onChange={(e) => {setVideoUrl(e.target.value)}}
                        InputProps={{ disableUnderline: true }}
                        inputProps={{
                          autoComplete: 'new-password',
                          form: {
                            autocomplete: 'off',
                          },
                        }}
                        sx={{ input: { color: "#1976d2" }}}
                        fullWidth
                        style={{
                          border: "none",
                          flex: 1,
                          marginLeft: 5
                        }}
                      />
                      <Button variant="contained" disabled={isProcessing} style={{margin: 5}} onClick={() => {
                        setIsProcessing(true);
                        fetch(`${baseUrl}/youtube-dl/process?url=${videoUrl}`)
                          .then(response => response.json())
                          .then(
                            data => {
                              setFilename(data.filename)
                              setVideoTitle(data.title)
                            },
                            cause => console.log(cause))
                          .catch(error => {
                            setIsProcessing(false);
                            console.log(error)
                          })
                      }}>
                        Procesar
                      </Button>
                    </Box>
                  </Box>
                }
                {
                  isProcessing &&
                  <Box style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 10}}>
                    <Box sx={{ width: '100%', marginBottom: 2 }}>
                      {
                        processingPercentage === 0.0 &&
                        <LinearProgress />
                      }
                      {
                        processingPercentage !== 0.0 &&
                        <LinearProgress variant="determinate" value={processingPercentage}/>
                      }
                    </Box>
                    <Typography style={{color: "#1976d2"}}> { processingPercentage }% </Typography>
                  </Box>
                }
                {
                  showDownloadButton &&
                  <Box style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 10}}>
                    <Typography style={{color: "#1976d2", marginBottom: 5, fontWeight: 'bold'}}> { videoTitle } </Typography>
                    <Box style={{display: "flex", justifyContent: "space-around", alignItems: "center", width: "100%"}}>
                      <Button variant="contained" component="a" href={`${baseUrl}/youtube-dl/song?filename=${filename}`}> Descargar </Button>
                      <Button variant="contained" onClick={() => {
                        setVideoTitle("");
                        setVideoUrl("");
                        setDownloadMessages([""]);
                        setFilename("");
                        setShowDownloadButton(false);
                        setProcessingPercentage(0);
                      }}> Reiniciar </Button>
                    </Box>
                  </Box>
                }
              </Box>
            </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
