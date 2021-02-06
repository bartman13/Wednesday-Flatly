import React, { useState, useEffect, useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import HomeIcon from '@material-ui/icons/Home';
import { Link as RouterLink } from 'react-router-dom';
import SnackbarContext from '../contexts/SnackbarContext';
import LoadingContext from '../contexts/LoadingContext';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Grupa WednesdayFlatly
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const cards = [1, 2,3 ,4,5,6];

export default function FlatList() {
  const classes = useStyles();
  const { setLoading } = useContext(LoadingContext);
  const { setSnackbar } = useContext(SnackbarContext);
  const [flats,SetFlats] = useState([]);
  const [page, SetPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState(false);

  async function fetchData(pg, sort, searchText) {
    setLoading(true);
    try {
        const flatData = await axios.get(`http://localhost:8080/flats?page=${pg}&sort=${sort}&nameOrCity=${searchText}`);
        setPageCount(flatData.data.pageCount);
        SetFlats(flatData.data.data);
    } catch (error) {
        console.error(error);
        setSnackbar({
            open: true,
            message: "Błąd ładowania danych",
            type: "error"
        });
    }
    setLoading(false);
}

    useEffect(() => {
        fetchData(0, sort, searchText);
    }, [SetFlats, setLoading, setSnackbar, setPageCount]);

  const onClickNext = ()=>
  {
    if(page<pageCount-1)
    {
      fetchData(page+1, sort, searchText);
      SetPage(page+1);
    }
  }

  const onClickPrev = () =>
  {
    if(page>0)
    {
      fetchData(page-1, sort, "");
      SetPage(page-1);
    }
  }

  const deleteFlat = async (flatId) => {
      setLoading(true);
        try
        {
          await axios.delete('http://localhost:8080/flats/' + flatId);
        }
        catch(error) {
          console.error(error);
          setSnackbar({
              open: true,
              message: "Błąd usuwania danych",
              type: "error"
          });
        }

        fetchData(page, sort, searchText);
  }

  const onTextChange = (e) => {
    fetchData(0, sort, e.target.value);
    setSearchText(e.target.value);
    SetPage(0);
  }
  
  const sortChange = () => {
    fetchData(page, !sort, searchText);
    setSort(!sort);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <HomeIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            Flat List
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            Flat List
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              App allows to manage all flats.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button   variant="outlined" color="primary">
                  <RouterLink  to="bookings">
                    Book List
                    </RouterLink>
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                  <RouterLink  to="addflat">
                    Add Flat
                    </RouterLink>
                  </Button>
                </Grid>
                <Grid item>
                <Button variant="outlined" color="primary" onClick={sortChange}> {sort ? "Disable sorting" : "Enable sorting"}
                  </Button>
                </Grid>
                <Grid item>
                  <TextField label="Search" onChange={onTextChange}>
                  </TextField>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {flats.map((flat) => (
              <Grid item key={flat} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={"http://localhost:8080/flats/" + flat.id + "/photo2"}
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {flat.name}
                    </Typography>
                    <Typography>
                      {flat.information}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" >
                      <RouterLink  to={"/flatlist/"+flat.id}>
                        View
                      </RouterLink>
                    </Button>
                    <Button size="small" color="primary">
                      <RouterLink  to={"/editflat/"+flat.id}>
                        Edit
                      </RouterLink>
                    </Button>
                    <Button size="small" color="primary">
                      <RouterLink  to={"/booking/"+flat.id}>
                        Bookings
                      </RouterLink>
                    </Button>
                    <Button size="small" color="primary" onClick={()=>deleteFlat(flat.id)}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Button onClick={onClickPrev}>Previous</Button>
        <Button onClick={onClickNext}>Next</Button>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}
