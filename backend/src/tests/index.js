const { access_token } = req.body;

if (!access_token) {
  return res.status(400).json({ error: "Access token is required" });
}

try {
  // 1. Validate token & get user profile from Google
  const response = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${access_token}` },
    }
  );

  console.log("Google user data:", response.data);

  const { email, name, picture } = response.data;

  if (!email) {
    return res.status(400).json({ error: "Email not available from Google" });
  }

  // 2. Find or create user in your DB
  let user = await User.findOne({ where: { email } });

  if (!user) {
    user = await User.create({
      email,
      name,
      avatar: picture,
      provider: "google",
      // any other default user fields
    });
  }

  const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json({
    success: true,
    token: jwtToken,
    user,
    message: "User authenticated successfully",
  });
} catch (error) {
  console.error(
    "Google login error:",
    error.response?.data || error.message || error
  );
  return res
    .status(401)
    .json({ success: false, message: "Invalid Google access token" });
}
