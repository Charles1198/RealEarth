const RESP_CODE_SUCCESS = 200
const RESP_CODE_FAILED_NORMAL = 201

function successResp(data, message) {
  return {
    code: RESP_CODE_SUCCESS,
    data,
    message: message || '',
  }
}

function failedResp(code, message) {
  return { code, message }
}

module.exports = { successResp, failedResp, RESP_CODE_FAILED_NORMAL, RESP_CODE_SUCCESS }