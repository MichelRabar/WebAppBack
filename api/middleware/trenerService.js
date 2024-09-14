const User = require('../models/usermodel');

async function getTrenerId(username) {
  try {
    // Pretraga korisnika prema username i vraćanje trenerId
    const user = await User.findOne({ username }).select('trenerId');

    if (!user) {
      throw new Error('Korisnik nije pronađen');
    }

    return user.trenerId || '';
  } catch (error) {
    console.error('Greška pri dohvaćanju trenerId:', error.message);
    throw error;
  }
}

module.exports = { getTrenerId };
