export const HTTP_RESPONSES = {
  // 1xx: Informational Responses
  CONTINUE: "Continue processing the request.",
  SWITCHING_PROTOCOLS: "Switching protocols as requested by the client.",

  // 2xx: Success Responses
  OK: "Request has been processed successfully.",
  CREATED: "Resource has been created successfully.",
  ACCEPTED:
    "Request has been accepted for processing, but the processing is not complete.",
  NON_AUTHORITATIVE_INFORMATION:
    "The returned meta-information is not from the origin server, but is gathered from a local or a third-party copy.",
  NO_CONTENT: "The request was successful but there's no content to return.",
  RESET_CONTENT:
    "The request was successful and the user agent should reset the document view.",
  PARTIAL_CONTENT:
    "The request was successful, but only a portion of the resource was returned.",

  // 3xx: Redirection Responses
  MOVED_PERMANENTLY: "The resource has permanently moved to a new location.",
  FOUND: "The resource has been temporarily moved to a new location.",
  SEE_OTHER: "The response to the request can be found under another URI.",
  NOT_MODIFIED: "The resource has not been modified since the last request.",
  USE_PROXY: "The requested resource must be accessed through a proxy.",

  // 4xx: Client Error Responses
  BAD_REQUEST:
    "The server could not understand the request due to invalid syntax.",
  UNAUTHORIZED:
    "The client must authenticate itself to get the requested response.",
  FORBIDDEN: "The client does not have access rights to the content.",
  NOT_FOUND: "The server could not find the requested resource.",
  METHOD_NOT_ALLOWED:
    "The method specified in the request is not allowed for the resource.",
  NOT_ACCEPTABLE:
    "The server cannot produce a response matching the list of acceptable values.",
  REQUEST_TIMEOUT: "The server timed out waiting for the request.",
  CONFLICT:
    "The request could not be completed due to a conflict with the current state of the resource.",
  GONE: "The resource requested is no longer available and will not be available again.",
  LENGTH_REQUIRED: "The request is missing a required `Content-Length` header.",
  PRECONDITION_FAILED:
    "The server does not meet one of the preconditions that the requester put on the request.",
  PAYLOAD_TOO_LARGE:
    "The request is larger than the server is willing or able to process.",
  URI_TOO_LONG: "The URI provided was too long for the server to process.",
  UNSUPPORTED_MEDIA_TYPE:
    "The media type of the requested data is not supported by the server.",
  RANGE_NOT_SATISFIABLE:
    "The server cannot fulfill the requested range of data.",
  EXPECTATION_FAILED:
    "The server cannot meet the expectations given in the `Expect` request header.",

  // 5xx: Server Error Responses
  INTERNAL_SERVER_ERROR:
    "The server has encountered a situation it doesn't know how to handle.",
  NOT_IMPLEMENTED:
    "The server does not recognize the request method or lacks the ability to fulfill the request.",
  BAD_GATEWAY:
    "The server, while acting as a gateway, received an invalid response from the upstream server.",
  SERVICE_UNAVAILABLE:
    "The server is not ready to handle the request, often due to overload or maintenance.",
  GATEWAY_TIMEOUT:
    "The server is acting as a gateway or proxy and did not get a response in time.",
  VERSION_NOT_SUPPORTED:
    "The server does not support the HTTP protocol version that was used in the request.",
  NETWORK_AUTHENTICATION_REQUIRED:
    "The client needs to authenticate to gain network access.",
};
