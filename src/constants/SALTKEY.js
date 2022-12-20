/***********************************************************
 * A SALT KEY THAT IS USED TO ENCRYPT-DECRYPT THE KEYID TO *
 *    GENERATE A TOKEN IN ORDER TO SECURE THE SESSIONS     *
 *                    PLEASE REFER TO :                    *
 *                - USEAUTH LINE 24                        *
 *                - PROTECTEDROUTE LINE 16                 *
 ***********************************************************/
// Exports the localSTORAGE_SALTKEY which is used to crypt encrypt KeyIds.
export const LOCALSTORAGE_SALTKEY = "S@LTK3Y";