// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await db.query(
    'SELECT * FROM admins WHERE username = ?',
    [username]
  );

  if (rows.length === 0) {
    return res.status(401).json({ message: 'Usuário inválido' });
  }

  const admin = rows[0];

  const valid = await bcrypt.compare(password, admin.password_hash);

  if (!valid) {
    return res.status(401).json({ message: 'Senha inválida' });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: '4h' }
  );

  res.json({ token });
});
