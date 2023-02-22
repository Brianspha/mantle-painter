//SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

/**
 *@dev File contains all structs to be used by the MantlePainter contract
 */
struct Pixel {
    uint256 tokenId;
    uint256 pixelIndex;
    bool occupied;
    address owner;
    string color;
}
struct Artist {
    address payable id;
    uint256 coloredPixels;
    bool active;
}
