{
  "version": "0.1.0",
  "name": "solana_chess",
  "instructions": [
    {
      "name": "initializeGame",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "stake",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "white",
            "type": "publicKey"
          },
          {
            "name": "black",
            "type": "publicKey"
          },
          {
            "name": "stake",
            "type": "u64"
          },
          {
            "name": "state",
            "type": {
              "defined": "GameState"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "GameState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "WaitingForOpponent"
          },
          {
            "name": "InProgress"
          },
          {
            "name": "Finished"
          }
        ]
      }
    }
  ]
}
