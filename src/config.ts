//config constants
export const SITE_URL = 'http://zvit.pixy.pro/';
export const API_URL = 'index.php/api/user/';
export const WORDPRESS_NONCE = SITE_URL + 'api/get_nonce/?controller=user&method=register';
export const LOGIN = SITE_URL + 'api/user/login/';
export const REGISTER = SITE_URL + 'wp-json/wp/v2/users';
export const GET_POSTS = SITE_URL + API_URL +'getPosts/';
export const GET_POSTS_BY_ID = SITE_URL + API_URL +'getPostsByCategoryId/';
export const SEND_MAIL = SITE_URL + API_URL +'sendMail/';
export const SEND_DEVICE_TOKEN = SITE_URL + API_URL +'sendToken/';
export const GET_POST = SITE_URL + API_URL +'getPost/';
export const GET_COMPANIES = SITE_URL + API_URL +'getCompanies/';
export const GET_COMPANY_INFO = SITE_URL + API_URL +'getCompany/';
export const CREATE_COMPANY = SITE_URL + API_URL + 'createCompany/';
export const RENAME_COMPANY = SITE_URL + API_URL + 'RenameCompany/';
export const DELETE_COMPANY = SITE_URL + API_URL + 'deleteCompany';
export const GET_GROUPS = SITE_URL + API_URL + 'getGroups/';
export const GET_PRODUCTS = SITE_URL + API_URL + 'getproducts/';
export const GET_PRODUCT_INFO = SITE_URL + API_URL + 'getProductInfo';
export const ADD_PRODUCT = SITE_URL + API_URL + 'addProductToCompany';
export const GET_CONTACT_INFO = SITE_URL + API_URL + 'getReferenceBooks';
export const GET_CONTACT_INFO_BY_ID = SITE_URL + API_URL + 'getPost';
export const GET_REFERENCE_BOOK= SITE_URL + API_URL + 'getReferenceBooks';
export const GET_REFERENCE_BOOK_BY_ID= SITE_URL + API_URL + 'getPost';
export const GET_TOKEN = SITE_URL + '/wp-json/jwt-auth/v1/token';
export const PARENT_ID_REFERENCE = 11;
export const PARENT_ID_CONTACTS = 65;

