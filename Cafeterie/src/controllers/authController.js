const { RegisterDTO, LoginDTO } = require('../dtos/AuthDTOs');
const { RegisterAction, LoginAction } = require('../actions/AuthActions');
const { AuthService } = require('../services/AuthService');
const UserRepository = require('../repositories/UserRepository');

function buildService() {
  const repo = new UserRepository();
  return new AuthService(repo);
}

exports.register = async (req, res) => {
  try {
    const dto = new RegisterDTO(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.password
    );
    const validation = dto.validate();
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const useCase = new RegisterUseCase(buildService());
    const result = await useCase.execute(dto);
    res.status(201).json(result);
  } catch (err) {
    if (err.message.includes('Email déjà utilisé')) {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.login = async (req, res) => {
  try {
    const dto = new LoginDTO(req.body.email, req.body.password);
    const validation = dto.validate();
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const useCase = new LoginUseCase(buildService());
    const result = await useCase.execute(dto);
    res.json(result);
  } catch (err) {
    if (err.message.includes('Identifiants invalides')) {
      return res.status(401).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
