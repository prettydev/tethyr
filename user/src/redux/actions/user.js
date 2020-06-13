import axios from "axios";
import config from "../../config/config";
import {
  NotificationColorMode,
  NotificationPosition,
  ResentLink,
} from "./notificationMessage";

export function loginUser(email, password, rememberMe) {
  return function (dispatch) {
    dispatch({ type: "LOGIN_USER" });

    axios
      .request({
        url: "/user/login",
        baseURL: config.apiBaseUrl,
        method: "post",
        auth: {
          username: email,
          password: password,
        },
      })
      .then((response) => {
        rememberMe && localStorage.setItem("_token", response.data.user.token);
        sessionStorage.setItem("token", response.data.user.token);
        sessionStorage.setItem("userId", response.data.user.user_id);
        sessionStorage.setItem("username", response.data.user.userName);
        dispatch({ type: "LOGIN_USER_FULFILLED", payload: response.data.user });
      })
      .catch((err) => {
        if (err.response) {
          dispatch({
            type: "SHOW_NOTIFICATION_MESSAGE",
            payload: {
              message: err.response.data.message,
              colorMode: NotificationColorMode.red,
            },
          });
          setTimeout(
            () => dispatch({ type: "HIDE_NOTIFICATION_MESSAGE" }),
            10000
          );
        } else {
          dispatch({
            type: "SHOW_NOTIFICATION_MESSAGE",
            payload: {
              message: "Invalid email or password",
              colorMode: NotificationColorMode.red,
            },
          });
          setTimeout(
            () => dispatch({ type: "HIDE_NOTIFICATION_MESSAGE" }),
            10000
          );
        }

        dispatch({ type: "LOGIN_USER_REJECTED", payload: err });
      });
  };
}

export function signupUser(user) {
  return function (dispatch) {
    dispatch({ type: "SIGNUP_USER" });

    axios
      .request({
        url: "/user/register",
        baseURL: config.apiBaseUrl,
        method: "post",
        data: user,
      })
      .then((response) => {
        localStorage.setItem("_token", response.data.user.token);
        sessionStorage.setItem("token", response.data.user.token);
        sessionStorage.setItem("userId", response.data.user.user_id);
        sessionStorage.setItem("username", response.data.user.userName);
        dispatch({
          type: "SIGNUP_USER_FULFILLED",
          payload: response.data.user,
        });
        dispatch({
          type: "SHOW_NOTIFICATION_MESSAGE",
          payload: {
            message:
              "Thanks for signing up! We have sent you an email confirmation. Please confirm your email and we will active your account!",
            colorMode: NotificationColorMode.green,
            position: NotificationPosition.top,
            resentLink: ResentLink.on,
          },
        });
      })
      .catch((err) => {
        if (err.response) {
          dispatch({
            type: "SHOW_NOTIFICATION_MESSAGE",
            payload: {
              message: err.response.data.message,
              colorMode: NotificationColorMode.red,
            },
          });
          setTimeout(
            () => dispatch({ type: "HIDE_NOTIFICATION_MESSAGE" }),
            10000
          );
        } else {
          dispatch({
            type: "SHOW_NOTIFICATION_MESSAGE",
            payload: {
              message: "Failed to sign up",
              colorMode: NotificationColorMode.red,
            },
          });
          setTimeout(
            () => dispatch({ type: "HIDE_NOTIFICATION_MESSAGE" }),
            10000
          );
        }

        dispatch({ type: "SIGNUP_USER_REJECTED", payload: err });
      });
  };
}

export function authenticateWithGoogle(user) {
  return function (dispatch) {
    dispatch({ type: "SIGNUP_USER" });

    axios
      .request({
        url: "/user/socialAuth",
        baseURL: config.apiBaseUrl,
        method: "post",
        data: user,
      })
      .then((response) => {
        localStorage.setItem("_token", response.data.user.token);
        sessionStorage.setItem("token", response.data.user.token);
        sessionStorage.setItem("userId", response.data.user.user_id);
        sessionStorage.setItem("username", response.data.user.userName);
        dispatch({
          type: "SIGNUP_USER_FULFILLED",
          payload: response.data.user,
        });
      })
      .catch((err) => {
        if (err.response) {
          dispatch({
            type: "SHOW_NOTIFICATION_MESSAGE",
            payload: {
              message: err.response.data.message,
              colorMode: NotificationColorMode.red,
            },
          });
          setTimeout(
            () => dispatch({ type: "HIDE_NOTIFICATION_MESSAGE" }),
            10000
          );
        } else {
          dispatch({
            type: "SHOW_NOTIFICATION_MESSAGE",
            payload: {
              message: "Failed to authenticate",
              colorMode: NotificationColorMode.red,
            },
          });
          setTimeout(
            () => dispatch({ type: "HIDE_NOTIFICATION_MESSAGE" }),
            10000
          );
        }

        dispatch({ type: "SIGNUP_USER_REJECTED", payload: err });
      });
  };
}

export function logoutUser() {
  return function (dispatch) {
    localStorage.setItem("_token", "");
    sessionStorage.setItem("token", "");
    sessionStorage.setItem("userId", "");
    sessionStorage.setItem("username", "");
    dispatch({ type: "LOGOUT_USER_FULFILLED", payload: {} });
  };
}

export function authenticateUser(token) {
  return function (dispatch) {
    dispatch({ type: "LOGIN_USER" });

    axios
      .request({
        url: "/user/authenticate_token",
        baseURL: config.apiBaseUrl,
        method: "post",
        headers: {
          "x-access-token": token,
        },
      })
      .then((response) => {
        sessionStorage.setItem("token", response.data.user.token);
        sessionStorage.setItem("userId", response.data.user.user_id);
        sessionStorage.setItem("username", response.data.user.userName);
        dispatch({ type: "LOGIN_USER_FULFILLED", payload: response.data.user });
      })
      .catch((err) => {
        dispatch({ type: "LOGIN_USER_REJECTED", payload: err });
      });
  };
}

export function confirmUserMail(unique_id, token, loggedIn) {
  return function (dispatch) {
    dispatch({ type: "LOGIN_USER" });

    axios
      .request({
        url: "/user/confirm",
        baseURL: config.apiBaseUrl,
        method: "post",
        data: {
          unique_id: unique_id,
          token: token,
        },
      })
      .then((response) => {
        localStorage.setItem("_token", response.data.user.token);
        sessionStorage.setItem("token", response.data.user.token);
        sessionStorage.setItem("userId", response.data.user.user_id);
        sessionStorage.setItem("username", response.data.user.userName);
        dispatch({ type: "LOGIN_USER_FULFILLED", payload: response.data.user });
      })
      .catch((err) => {
        if (loggedIn) {
          dispatch({ type: "CONFIRM_USER_LOGIN_REJECTED", payload: err });
        } else {
          dispatch({ type: "CONFIRM_USER_SIGNUP_REJECTED", payload: err });
        }
      });
  };
}

export function updateUserProfile(token, params, showOverlaySpinner) {
  return function (dispatch) {
    showOverlaySpinner && dispatch({ type: "SHOW_OVERLAY_SPINNER" });
    dispatch({ type: "UPDATE_USER" });

    axios
      .request({
        url: "/user/update_profile",
        baseURL: config.apiBaseUrl,
        method: "post",
        headers: {
          "x-access-token": token,
        },
        data: params,
      })
      .then((response) => {
        localStorage.setItem("_token", response.data.user.token);
        sessionStorage.setItem("token", response.data.user.token);
        sessionStorage.setItem("userId", response.data.user.user_id);
        sessionStorage.setItem("username", response.data.user.userName);
        dispatch({
          type: "UPDATE_USER_FULFILLED",
          payload: response.data.user,
        });
        dispatch({ type: "HIDE_OVERLAY_SPINNER" });
      })
      .catch((err) => {
        dispatch({
          type: "SHOW_NOTIFICATION_MESSAGE",
          payload: {
            message: "Failed to update profile",
            colorMode: NotificationColorMode.red,
          },
        });
        setTimeout(
          () => dispatch({ type: "HIDE_NOTIFICATION_MESSAGE" }),
          10000
        );

        dispatch({ type: "UPDATE_USER_REJECTED", payload: err });
        dispatch({ type: "HIDE_OVERLAY_SPINNER" });
      });
  };
}

export function updatePassword(token, newPassword) {
  console.log(token);
  return function (dispatch) {
    dispatch({ type: "SHOW_OVERLAY_SPINNER" });
    dispatch({ type: "UPDATE_USER" });

    axios
      .request({
        url: "/user/update_password",
        baseURL: config.apiBaseUrl,
        method: "post",
        headers: {
          "x-access-token": token,
        },
        data: {
          new_password: newPassword,
        },
      })
      .then((response) => {
        console.log(response);
        dispatch({
          type: "UPDATE_USER_FULFILLED",
          payload: response.data.user,
        });
        dispatch({ type: "HIDE_OVERLAY_SPINNER" });
      })
      .catch((err) => {
        dispatch({
          type: "SHOW_NOTIFICATION_MESSAGE",
          payload: {
            message: "Failed to update password",
            colorMode: NotificationColorMode.red,
          },
        });
        setTimeout(
          () => dispatch({ type: "HIDE_NOTIFICATION_MESSAGE" }),
          10000
        );

        dispatch({ type: "UPDATE_USER_REJECTED", payload: err });
        dispatch({ type: "HIDE_OVERLAY_SPINNER" });
      });
  };
}

export function updateRole(token, email, role_id, hostedPageId) {
  return function (dispatch) {
    dispatch({ type: "SHOW_OVERLAY_SPINNER" });
    dispatch({ type: "UPDATE_USER" });

    axios
      .request({
        url: "/chargebee/subscribe-postproc",
        baseURL: config.apiBaseUrl,
        method: "post",
        headers: {
          "x-access-token": token,
        },
        data: {
          email,
          role_id,
          hostedPageId,
        },
      })
      .then((response) => {
        console.log(response.data.user, "res from role change api");
        dispatch({
          type: "UPDATE_USER_FULFILLED",
          payload: response.data.user,
        });
        dispatch({ type: "HIDE_OVERLAY_SPINNER" });
      })
      .catch((err) => {
        dispatch({
          type: "SHOW_NOTIFICATION_MESSAGE",
          payload: {
            message: "Failed to update password",
            colorMode: NotificationColorMode.red,
          },
        });
        setTimeout(
          () => dispatch({ type: "HIDE_NOTIFICATION_MESSAGE" }),
          10000
        );

        dispatch({ type: "UPDATE_USER_REJECTED", payload: err });
        dispatch({ type: "HIDE_OVERLAY_SPINNER" });
      });
  };
}
