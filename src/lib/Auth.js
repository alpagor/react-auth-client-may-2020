import React from "react";
import axios from "axios";

//React context that provide us the 2 components consumer & provider
const { Consumer, Provider } = React.createContext();

// HOC we use this function to wrap any component to be a cosumer
function withAuth(WrappedComponent) {
  // we return an anonymous component (return function...) and then we
  // said what we want to do with the wrapped component. We want to wrap that component on the
  // Consumer tag. In order to start reading the data arriving from the Provider "value" we pass the props (mandatory if the component has is own props)
  // on the highOrder component and set a function inside {}. This function take as argument the Provier's value,
  // and we use it to inject inside the component what we want (in our case user obj, etc...).

  return function (props) {
    return (
      <Consumer>
        {(valueFromProvider) => (
          <WrappedComponent
            {...props}
            user={valueFromProvider.user}
            isLoggedIn={valueFromProvider.isLoggedIn}
            isLoading={valueFromProvider.isLoading}
            login={valueFromProvider.login}
            signup={valueFromProvider.signup}
            logout={valueFromProvider.logout}
          />
        )}
      </Consumer>
    );
  };
}

// 1. create our "Provider" component
class AuthProvider extends React.Component {
  //1.1b AuthProvider will have the following state
  state = {
    user: null,
    isLoggedIn: false,
    isLoading: true,
  };

  componentDidMount() {
    // 1.3  When app and AuthProvider load for the first time
    // make a call to the server '/me' ,this route is checking if we have a cookie,
    // check if user is authenitcated and return a user obj
    // if the user is loggein we set the state and save the user object inside of the state
    axios
      .get("http://localhost:5000/auth/me", { withCredentials: true })
      .then((response) => {
        const user = response.data;
        this.setState({ isLoggedIn: true, isLoading: false, user });
      })
      .catch((err) =>
        this.setState({ isLoggedIn: false, isLoading: false, user: null })
      );
  }
  //Once we have the user object we should save it and change the state flag to true
  // When someone try to send date trough the form, we will make a request to the backend
  // and get username and password and save the user obj in setState. In order to include the
  // cookies in the request we set "withCredentials: true".

  login = (username, password) => {
    axios
      .post(
        "http://localhost:5000/auth/login",
        { username, password },
        { withCredentials: true }
      )
      .then((response) => {
        const user = response.data;
        this.setState({ isLoggedIn: true, isLoading: false, user });
      })
      .catch((err) => console.log(err));
  };
  signup = (username, password) => {
    axios
      .post(
        "http://localhost:5000/auth/signup",
        { username, password },
        { withCredentials: true }
      )
      .then((response) => {
        const user = response.data;
        this.setState({ isLoggedIn: true, isLoading: false, user });
      })
      .catch((err) => console.log(err));
  };

  //When the response get back we don't need the user obj (const user = response.data). And we destroy the
  // session

  logout = () => {
    axios
      .get("http://localhost:5000/auth/logout", { withCredentials: true })
      .then((response) => {
        this.setState({ isLoggedIn: false, isLoading: false, user: null });
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { user, isLoggedIn, isLoading } = this.state; //deconstructoring the state properties needed
    const { login, signup, logout } = this;

    return (
      //1.1a in order to let this component a Provider we create the tag <provider>
      //we will put what we want provide to the entire Application {this.props.children} = {App.js} inside the object value
      //this will be what we want to share with the consumer components and that we borrow from the state
      // last but not least we will go to Index.js and we will wrap the App.js into the AuthProvider (step 1.2).
      <Provider value={{ user, isLoggedIn, isLoading, login, signup, logout }}>
        {this.props.children}
      </Provider>
    );
  }
}

export { withAuth, AuthProvider };
