{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs-16_x
    imagemagick
  ];

  shellHook = ''
    echo Execution environment for Nodejs projects
  '';
}
