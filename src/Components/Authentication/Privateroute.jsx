const PrivateRoute = ({ element: Element, ...rest }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  return isAuthenticated ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
};