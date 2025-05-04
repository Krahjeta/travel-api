function Login() {
    return (
      <div>
        <h2>Login</h2>
        <form>
          <div>
            <label>Email:</label>
            <input type="email" name="email" />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
  
  export default Login;
  