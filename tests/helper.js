const nativeFs = require("fs");
const path = require("path");

const DevNullStream = require("dev-null-stream");
const cwd = process.cwd();

const toMockPath = absPath => {
  const rel = path.relative(cwd, absPath);
  return "/" + rel.split(path.sep).join("/");
};

const mockFs = () => {
  const devNullStream = new DevNullStream();
  const createReadStreamMock = jest.fn();
  const createWriteStreamMock = jest.fn();
  const writeFileSyncMock = jest.fn();
  const fs = {
    existsSync: nativeFs.existsSync,
    createReadStream: absPath => {
      createReadStreamMock(toMockPath(absPath));
      return nativeFs.createReadStream(absPath);
    },
    createWriteStream: absPath => {
      createWriteStreamMock(toMockPath(absPath));
      return devNullStream;
    },
    writeFileSync: (absPath, content) => {
      writeFileSyncMock(toMockPath(absPath), content);
    }
  };
  const filesCreated = () => writeFileSyncMock.mock.calls.length;
  const name = index => writeFileSyncMock.mock.calls[index][0];
  const content = index => writeFileSyncMock.mock.calls[index][1];
  const names = () => writeFileSyncMock.mock.calls.map(x => x[0]);
  return {
    // mocks
    createReadStreamMock,
    createWriteStreamMock,
    writeFileSyncMock,
    fs,
    // helpers
    filesCreated,
    content,
    name,
    names
  };
};

exports.mockFs = mockFs;
