const { jest } = require("@jest/globals");

const mockPlayer = {
  loop: false,
  play: jest.fn(),
  pause: jest.fn(),
  remove: jest.fn(),
  addListener: jest.fn(() => ({ remove: jest.fn() })),
};

module.exports = {
  useAudioPlayer: jest.fn(() => mockPlayer),
  createAudioPlayer: jest.fn(() => mockPlayer),
};
