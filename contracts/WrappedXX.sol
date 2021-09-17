pragma solidity 0.6.12;

import "@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";


contract WrappedXX is ERC20PresetMinterPauser {

    /**
     * @dev Builds ERC20PresetMinterPauser with name WrappedXX, symbol WXX, and decimals 9
     */
    constructor() public ERC20PresetMinterPauser("WrappedXX", "WXX") {
        _setupDecimals(9);
    }
}
