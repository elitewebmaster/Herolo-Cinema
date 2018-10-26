import React, { Component } from 'react';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { setMovies, setToggle } from '../actions';
import axios from 'axios';
import Movie from './Movie';
import Delete from './Delete';
import NewEdit from './NewEdit';
import Loading from './Loading';
import logo from '../../src/logo.svg';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faPlus, faEdit, faTrash, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

library.add(faFilm, faPlus, faEdit, faTrash, faTimes, faCheck);

class App extends Component {
  state = {
    loading: true
  }

  componentDidMount() {
    let moviesListArr = [];
    axios.get('https://www.omdbapi.com/?s=Batman&apiKey=e8dc217a').then(resp => { 
        let moviesList = resp.data.Search.map(async (movie) => {
        await axios.get(`https://www.omdbapi.com/?apiKey=e8dc217a&i=${movie.imdbID}`).then(details => { 
          moviesListArr.push(details.data);
          return details.data;
        });
      })
  
      Promise.all(moviesList).then(() => {
        this.props.setMovies(moviesListArr);
        this.setState({ loading: false });
      });
  
    });
  }

  render() {
    let { list } = this.props;
    let { active, action } = this.props.toggle;
    let { loading } = this.state;
    let result = null;

    if(list.length > 0 && !loading){
      result = list.map((res, index) => <Movie key={res.imdbID} res={ res } index={ index } />);
    }
    else if(loading){
      result = <Loading />
    }
    else {
      result = <Col><Alert color="info text-center mt-3 mb-3">No Result</Alert></Col>
    }

    return (
      <div className="mt-3 mb-3">
        <header>
          <h1 className="text-center"><img className="logo" src={logo} alt="React" /> Herolo Cinema</h1>
        </header>

        <Container className="mt-3 mb-3">
          <Row>
            <Col className="text-center">
              {
                (!loading) && 
                  <Button color="primary" onClick={()=> this.props.setToggle(null, "new")}><FontAwesomeIcon icon="plus" /> Add new movie</Button>
              }
              
            </Col>
          </Row>
          <Row>
            {result}
          </Row>
        </Container>

        {
          (action === "delete" || action === "edit" || action === "new") && 
          <div>
            <Delete active={ active } action={ action } list={ list } />

            <NewEdit active={ active } action={ action } list={ list } selected={list[active]} /> 
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, { setMovies, setToggle })(App);