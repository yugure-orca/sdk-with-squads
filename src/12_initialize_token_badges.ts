import { getDeleteTokenBadgeInstruction, getInitializeTokenBadgeInstruction, getTokenBadgeAddress } from "@orca-so/whirlpools-client";
import { address, createKeyPairFromBytes, createNoopSigner, createSignerFromKeyPair } from "@solana/kit";
import { Connection  } from "@solana/web3.js";
import { buildAndSendTransaction, setRpc } from "@orca-so/tx-sender";
import { getNextTransactionIndex, getVaultPda, createSquadsVaultTransactionInstruction } from "./squads_utils";

import proposerWalletSecret from "../proposer_wallet_banana.json";

const ORCA_WP_OPS_MULTI_SIG_WALLET = address("5J.................");
const ORCA_WP_CONFIG = address("2LecshUwdy9xi7meFgHtFJQNSKk4KdTrcpvaB56dP2NQ");
const ORCA_WP_CONFIG_EXTENSION = address("777H5H3Tp9U11uRVRzFwM8BinfiakbaLT8vQpeuhvEiH");

const TOKEN_BADGE_MINTS = [
  /*
  "gEGtLTPNQ7jcg25zTetkbmF7teoDLcrfTnQfmn2ondo",
  "iy11ytbSGcUnrjE6Lfv78TFqxKyUESfku1FugS9ondo",
  "hM7B3UQTTR81mS27SxDDPzBbjejmo8fnpFjzgv9ondo",
  "14W1itEkV7k1W819mLSknFTaMmkCtPokbF2tRkPUondo",
  "cJpUMp5R7rZ6fGeLHbHhrRuJzK9mkyKDjZqNpT3ondo",
  "HfsnTS5qtdStwec9DfBrunRqnAMYMMz1kjv9Hu9ondo",
  "k18WJUULWheRkSpSquYGdNNmtuE2Vbw1hpuUi92ondo",
  "7qy1j4Mechfyr6uAST3djH4vk4kiEYC2cjEytXdondo",

  "TnfswqdE1jAJ8sfnf5J7kSVLEH1cfpAYZ8MWmKfondo",
  "mqL8yXQpeSvc7NgrAtLLPtRvUiWyLoG5RWLv16iondo",
  "Gwh9fPsX1qWATXy63vNaJnAFfwebWQtZaVmPko6ondo",
  "HrYNm6jTQ71LoFphjVKBTdAE4uja7WsmLG8VxB8ondo",
  "a2cXfonVgQ6cKB4Lm8YZsPry39VZSA562bwmRSiondo",
  "5hT2o25X9tGXipwhLckaUdgnxrZ6Y8eiUwdhpLeondo",
  "12J2LD3tuLfdiVKnWZMHRMrbnXDY9rM4yqVLUa5yondo",
  "YXE7mph6XhsgnyezkMEcTuohSuWhbLWfwx2Hh6mondo",

  "GeV7S8vjP8qdYZpdGv2Xi6e7MUMCk8NAAp2z7g5ondo",
  "cBnVXDyZgaaLZM18wAmqsUKnRUFAEJWbq6VuUoaondo",
  "123mYEnRLM2LLYsJW3K6oyYh8uP1fngj732iG638ondo",
  "ou1uE526v7zmUYP2qCb2LJgfXAyWAtWS9SETtr8ondo",
  "exYfSJt6Fgfhfnp3bAD4roYy97hLF9npjYaLyEXondo",
  "m9GcsVgdjaL3KsdtSFHimnhtsUMpTHkjtwEG4Tzondo",
  "igu1coP6n3GPaWmbd8J9Z7UAyLpV254uQFFNfydondo",
  "FRmH6iRkMr33DLG6zVLR7EM4LojBFAuq6NtFzG6ondo",

  "WKMZummev5UcXz5nNKQZvTD6QjNSM2X58uwmDReondo",
  "KeGv7bsfR4MheC1CkmnAVceoApjrkvBhHYjWb67ondo",
  "D1tu7Fnm3cCpKyyPXrqm5GXShPqMj7a2SEjjq9fondo",
  "C9xNaNujcF1a5fidWAAFReFYqhLRVbyk4yPyGqzondo",
  "dvj2kKFSyjpnyYSYppgFdAEVfgjMEoQGi9VaV23ondo",
  "ETCJUmuhs5aY62xgEVWCZ5JR8KPdeXUaJz3LuC5ondo",
  "14Tqdo8V1FhzKsE3W2pFsZCzYPQxxupXRcqw9jv6ondo",
  "14diAn5z8kjrKwSC8WLqvBqqe5YmihJhjxRxd8Z6ondo",

  "g4KnPrxPLeeKkwvDmZFMtYQPM64eHeShbD55vK6ondo",
  "c5ug15fwZRfQhhVa6LHscFY33ebVDHcVCezYpj7ondo",
  "9wYZetvT8J2ptfsRca5gzLBGvcUug38mp9yT3xaondo",
  "MYXqkDYbzr7vjXAz2BapR4AiYRXzoikGirrLoRzondo",
  "GmDADFpfwjfzZq9MfCafMDTS69MgVjtzD7Fd9a4ondo",
  "Fz9edBpaURPPzpKVRR1A8PENYDEgHqwx5D5th28ondo",
  "jLca79XzcewRuBZyaJxVxuKpUHcEix1X4CP1RP9ondo",
  "yQ37dFiGAbzrb2FRAEhGNzRy5zFfoYGWYhAepFEondo",

  "Wk8gC6iTNp8dqd4ghkJ3h1giiUnyhykwHh7tYWjondo",
  "916SDKz7y5ZcEZC9CtnQ5Djs1Y8Yv3UAPb6bak8ondo",
  "5owVsVFSHACQuippFYdLp3qWRobp2EGcwxMmsr6ondo",
  "WNZBSkNBNP3Ct1pcFn6Fu4sZQFhnu48EsM9voCEondo",
  "qCYD74QnXzd9pzv6pGHQKJVwoibL6sNcPQDnpDiondo",
  "1FWZtdWN7y38BSXGzbs8D6Shk88oL9atDNgbVz9ondo",
  "BVdXGvmgi6A9oAiwWvBvP76fyTqcCNRJMM7zMN6ondo",
  "bbahNA5vT9WJeYft8tALrH1LXWffjwqVoUbqYa1ondo",

  "13QHuepdhtJ3urNsV9i1hdL8nQoca2G7ZaLzb5FYondo",
  "M77ZvkZ8zW5udRbuJCbuwSwavRa7bGAZYMTwru8ondo",
  "7DWcZE1uVc8m2mf9pV8KNov28ET7HsvHkhrhgr9ondo",
  "G7pTVoSECz5RQWubEnTP7AC83KHUsSyoiqYR1R2ondo",
  "GRciFCqJ5y2hbiD6U5mGkohY65BZTXGuGUrCqf7ondo",
  "KcCVQxG9LhFYP5o9DWFKTFgFShPPQkDEemVbiFyondo",
  "LZddqAqKqJW9oMZSjTxCUmbmzBRQtv9gMkD9hZ3ondo",
  "hqJXutLF6f7DxStrWCrnZDfXzbNTZmvi3KheVi6ondo",

  */
  //-----------------------------------------------------------------------------------------------------------

  "dwEPNKQab3iwRmjGvZPXhAmws1W5NsQGwuXwi8oondo",
  "cdVNL7wK8mf1UCDqM6zdrziRv4hmvqWhXeTcck2ondo",
  "vE2qArmjto6VfeMngyGAnzp2ipLYeXsxiARDnnXondo",
  "KJNeFW3kk3ycPjXpC6cbuyckjeYHacc2ekhtAi5ondo",
  "hWfiw4mcxT8rnNFkk6fsCQSxoxgZ9yVhB6tyeVcondo",
  "KaSLSWByKy6b9FrCYXPEJoHmLpuFZtTCJk1F1Z9ondo",
  "e6G4pfFcrdKxJuZ4YXixRFfMbpMvgXG2Mjcus71ondo",
  "FSz4ouiqXpHuGPcpacZfTzbMjScoj5FfzHkiyu2ondo",
  "bn1fb8dwzafGePqNPrM8m8cbAKQiFqeEPuZkPySondo",
  "ivdDracs2s7jCP698dJXKSEQdVrNj9hasJL1Uq1ondo",
  "AXRsYFt7TXNQ3DcY6BkvRgPV6VsYMURyDtaeudjondo",
  "aLDdFsr3VTUQaHFK6yNvQxztvxQ8nxW4AMuSGC7ondo",
  "mJf1xT3suXtkXBCfZcE9oUUuyxkvSgqYBWiX7v1ondo",
  "cfPLN9WXD2BTkbZhRZMVXPmVSiRo44hJWRtnaC8ondo",
  "AbvryMGnaba9oADMZk8Vp2Av6MtczsncGyfWaC4ondo",
  "FovBwhoV5KQjZCdhoM6jgXYwXLX3F8vgAfvmLH7ondo",
  "UP5s1srLaHDc4SwJqLPa3A48x5R7ofN3hZWxWEZondo",
  "bdh3njeo19d2TBLAKTGvCWdSoArfVw8uZBAJHY4ondo",
  "qKtU9A7ij34XmtxaSzYfxCpkgAZzzFsqnUb2kW2ondo",
  "7D7ukbcnUNYt7Et5vtsDZhAy28MKu9pkHka1Hp9ondo",
  "gud6b3fYekjhMG5F818BALwbg2vt4JKoow59Md9ondo",
  "i6f3DvZBuLpnGSqS8x6WPeStJ7jNe5KewD6afD5ondo",
  "7tgKziACteG26VjV5xKufojKxwTgCFyTwmWUmz5ondo",
  "sxyg1VTSzy5zYANUK7hntNtmFAWoXGJq95AcHuVondo",
  "HjrN6ChZK2QRL6hMXayjGPLFvxhgjwKEy135VRjondo",
  "L6ZE5qCpVVSqLePz64CrwkgyWoPF9M7tB8BeFH4ondo",
  "NKyzy31w2J7odLb2CW3Ft4fpKXkW3LBt1pvpkVLondo",
  "g646pcdG2Rt5DH9WZzL7VVnVDWCCMTTrnktwE74ondo",
  "6xHEyem9hmkGtVq6XGCiQUGpPsHBaoYuYdFNZa5ondo",
  "C9J9vZ8N79GzzxFoRkPWCkGtMKU8akg4FhUk4r9ondo",
  "aznKt8v32CwYMEcTcB4bGTv8DXWStCpHrcCtyy7ondo",
  "PjtfUiw6Hwd8PZ94EcUw8mBSYxp7SjjzSLeNTDKondo",
  "81xLFvCzFaUM3KDxSHC75pXu3RPCeSeCbmGBY8aondo",
  "129gRoHKhVg7CvPMrqVsEB4uYZo6zV4yDZX6NBg9ondo",
  "JmFLCBwoNvcXy6B2VqABg6m784ubkXpaEx3p7S5ondo",
  "fDxs5y12E7x7jBwCKBXGqt71uJmCWsAQ3Srkte6ondo",
  "wFJoeEYpKg9oRhyJy6BWTT3J95gmXBLvoeikDQNondo",
  "cnc6M1zXLdrGR5LAQVcaJDfgezMiVWNtGQsVy1Kondo",
  "E5Gczsavxcomqf6Cw1sGCKLabL1xYD2FzKxVoB4ondo",
  "5u6KDiNJXxX4rGMfYT4BApZQC5CuDNrG6MHkwp1ondo",
  "keybg184d4vyXeQdFqs4o99YsMg7xBthxTJ6Ky3ondo",
  "GZ8v4NdSG7CTRZqHMgNsTPRULeVi8CpdWd9wZY8ondo",
  "hrmX7MV5hifoaBVjnrdpz698yABxrbBNAcWtWo9ondo",
  "XwFm5GiKPVTvPiEbQpdc6vJbFEpsUXRMf6TcSxnondo",
  "E1aUS5nyv7kaBzdQzPVJW5zfaMgoUJpKYzdnFS2ondo",
  "C8bZkgSxXkyT1RgxByp2teJ24hgimPLoyEYoNa9ondo",
  "1GNFMryQ6c9ZpMhgNimmsbtgYM21qnBJgRAFoNiondo",
  "13qtwy5fZi9Przz14pzo9xqFSr8QHmLyUpUCvP1xondo",
  "M6agiXbNgy8Xon9ngiW4ZDPbMFcNCTMkMMkshZyondo",
  "rpydAzWdCy85HEmoQkH5PVxYtDYQWjmLxgHHadxondo",
  "kPBGL8vAwKN3UGmr9cjkM2dU79SC3nzTC9yu7F8ondo",
  "7eRX747PSbVtGVx3qD5UFdkNM2BfTy86ikUiCMhondo",
  "BWxe2FVciUbwrCUZQPUKiREBh5LmVa5AiUqNLAkondo",
  "m6oDLvJT7rY7M1TxuLWP3pWmAPg2cCWDQR1NKiEondo",
  "1zvb9ELBFShBCWKEk5jRTJAaPAwtVt7quEXx1X4ondo",
  "M7hVQomhw4Q2D2op3HvBrZjHu9SryjNvD5haEZ1ondo",
  "t7eN6cGwRMFaZvsNW2SmVwkedmHtDdrxA4ycNE5ondo",
  "14VXAhoa1R74vi1ZuiQyGLJrnDMfoFBPJSCpGVz3ondo",
  "14VP7DvCAdBCc5XGNZkPt6zhtPzJrWWS64Koxtxyondo",
  "13qTjKx53y6LKGGStiKeieGbnVx3fx1bbwopKFb3ondo",
  "X68p9qTpEMkR1TLpXUP2ZJo8PG4Qge2Y2ZLdjA2ondo",
  "KUXt7LzHWSQXp5eyqMZRxWjAP6yM8BUh4LRHwiwondo",
  "12LxMMJYVSf4LoeqjFE47BQQNRciaH9E3nbDfjH4ondo",
  "kxEW4oJL75K37VeXaZF1ynbHQATQwhECQKN1374ondo",
  "jCCU4GwukjNxAXJowG2S4KCrr5g6YyUB61WHYvGondo",
  "X7j77hTmjZJbepkXXBcsEapM8qNgdfihkFj6CZ5ondo",
  "iLDu2jjp2i3Uqc2Vm7K7GLiUj3hR4Un49MtD7c4ondo",
  "iPFqjcZQTNMNXA4kbShbMhfAVD8yr8Uq9UtXMV6ondo",
  "12BvLZtzjdssAycxPeBQUjukhmgQpULAvy6SroYdondo",
  "12Rh6JhfW4X5fKP16bbUdb4pcVCKDHFB48x8GG33ondo",
  "Cq6QtvHpXbJWtFaiMhUDtHy8YVZ95gcD1oZ1cohondo",
  "MFerpBVGKZh2jXN7cbJdXRXQTp6j6pbSnSZrfWrondo",
  "1YVZ4LGpq8CAhpdpm3mgy7GgPb83gJczCpxLUQ3ondo",
  "CozoH5HBTyyeYSQxHcWpGzd4Sq5XBaKzBzvTtN3ondo",
  "ZmHxc6Gt27RJKxD2ay6UL4n9yQ7mKAq4XZQUeVhondo",
  "CqW2pd6dCPG9xKZfAsTovzDsMmAGKJSDBNcwM96ondo",
  "14Z8rQQe2Aza33YgEUmj3g3QGNz8DXLiFPuCnsD1ondo",
  "15SsCZqCsM9fZGhTmP4rdJTPT9WGZKazDSsgeQ8ondo",
  "CPWkMURVvcnX8hGjqCTb8i5LkzV3VSvyk7SeJi8ondo",
  "HXFrTf9v9NdjGUTnx4sojR3Cf92hoBsQFUxKTN7ondo",
  "128qNYovdGv2YqayErcJgU7gDwbNVX1VuoxbtWz8ondo",
  "JrTYw7A9jihX5TwpRStYviEbsYf2X2VJpZ13719ondo",
  "aKzjn2ZdWySSGPSSDTY2HUpcSCmemSahTXihrpyondo",
  "PnjETBCLC318DRejo9cMQKAmET9PvW8AEFGWMNtondo",
  "pDY4GPJfZcNETPG7myXeafQfgJqqVkn81bMYDyfondo",
  "KZtqx9BJbpcGY7vdzhqPXM3ECKChxE5YhXaDiwRondo",
  "EsVHcyRxXFJCLMiuYLWhoDygrNe1BJGpYeZ17X7ondo",
  "ThwGDsXZ6iKubWuEQjmDxGwF3bUERDGbBXvcbjFondo",
  "MtEXKVN3Pcggy8MPA3eJr15H6SK3RXheScqj9qtondo",
  "R2uDbMtmHq5xSS5SserrovdRKdpiqnVBCd2AHLhondo",
  "LmTMwmZLNZszn3qpjmnbhfP12U4qWDivaEBwSBSondo",
  "eGGxZwNSfuNKRqQLKaz2hc4QkA2mau7skyxPdj7ondo",
  "doPqjCxi6UkANkvMz5fSuYGEo5PGppVpTZMeB5vondo",
  "v12TwfofSbvVqQ5N5KGG4d3J8rtEi4BjGfn2apyondo",
  "jzCvs2Pk8tDcfsFRqnEMjurgaQW4iQfEkandUR8ondo",
  "aTBfDuLRqYHBiG82bHA7DzwjSDTFre2dRtGH3S5ondo",
  "MkN2TZSYTFBdMRLf9EVcfhstTwnazH8knd9hpepondo",
  "83P1gCFBZfGRCwJuBt9juxJKEsZwejJoG66eTZ6ondo",
  "h6MW8GFpfzxFa1JNn6hZNnBF3t4fj9SHAXKy6LXondo",
  "KuiYLPVq65qixD9TgvxBC576C4gG6vVTCdbh2zFondo",
  "EUbJjmDt8JA222M91bVLZs211siZ2jzbFArH9N3ondo",
  "SS6AEWhzRrxhL2cXzKKjhFt3rCzmHHGKmFyugDTondo",
  "dSHPFuMMjZqt7xDYGWrexXTSkdEZAiZngqymQF2ondo",
  "o6U1Sm6Vd7EofMyCrL28mrp2QLzgYGgjveHiEQ5ondo",
  "cdKfoNjbXgnSuxvoajhtH3uixfZhq1YXhQsS1Rwondo",
  "1MGRpPrkhEsCm2GCWD3rsvEU77xTTLAzfKXeFgFondo",
  "9PMjLqd8zPdKkJUXarnit5t7tPL3cCscwHzy7ATondo",
  "7NWHifsBnn9DimUeNnsHdEXkTZhXmJTiXxcCngBondo",
  "AErxJJxGbc9cZzZoZepN62BNfg5RXns8tmEc3Zpondo",
  "edLdFJVVR532qhcrNTJjLAmhmyV7NsctbWVokMBondo",
  "A9PFmw9Hu8zzxDUoU351pio1E1XWBWBfWnjT9qoondo",
  "Gc1aT3ay7FXL3qdAW7cNSXYPDsGavy7qiACuxwxondo",
  "6btaz134wjHkR8sqhAYrtSM6tavftfxnRvnyMd8ondo",
  "Edik9MoFp8LAXS9HNu2gRFyihwYqDqv4ZmNmVT9ondo",
  "1WxT6NdK7uqpfXuKpALxL2n3f7Rq61XXeHA8UM4ondo",
  "FGmUDXqA3AbWfo5b3NUcsvwoUFCF4tr9ea6uercondo",
  "14kLsQVmc64qZexYuR4XGop9y8BeMkd77pJUm1Rhondo",
  "54CoRF2FYMZNJg9tS36xq5BUcLZ7rju1r59jGc2ondo",
  "BchJRy2snmhJZf3rQ9LJ3ePs2BGfYgfvQNo31d2ondo",
  "EoReHwUnGGekbXFHLj5rbCVKiwWqu32GrETMfw4ondo",
  "tiitb2Z1HtpB2DpVr6V7tdCFS3jmTinLeuGj9EVondo",
  "mhZ69E1vDnAsQJXAwarLYSX5tmgeMajXBJ2rXAcondo",
  "T699bgtXQw4CJ59rQ4VzLsupVQUzoL5RmuhHnKrondo",
  "1eLZPRsn8bAKmoxsqDMH9Q2m2k7GMNp6RLSQGm8ondo",
  "NrTdGMA3ujUvWXkwXyZKnhoByb32KTjRh5Vo47yondo",
  "149o8ppQf9SzKCKXZ4v3dzHkwumvtQSRzSEkr29uondo",
  "k6BPp2Xmf2TYgrZiUyWfUoZBKeqaDbvPoAVgSx2ondo",
  "CqQyAZjB9LGFTG95eiadGTkfhd9QA12ProeKsQmondo",
  "bgJWGuQxyoyFeXwzYZKBmoujVdatGFYPNFnv1a6ondo",
  "Ao5rKFRQ54W3DKSAtqfhBRPNHewwWRLNLao2JL9ondo",
  "R3ywbVQ5t8LNmjQsn2Ngv43dSqyZscQwNag9G3Eondo",
  "gbHFTMkuMQUy5xrgoCBdaQ2XYvNyjWAYcnRPh9Condo",
  "DX7g7WNjDpVzNK9CG81v7wb6ZbiNzYfkdzH2Xs5ondo",
  "td1aY5AvYQuwGD75qNq9aPipMexraN9mQXJwqifondo",
  "YeK2TdPtGLAme3Phg4pb1GBN2YxKgX5UNVyD4asondo",
  "gnoSQSNTNZHViqVfxCcPDVxcRA29mrJL7C6JqYLondo",
  "5H1VpMzRuoNtRbPTRCz35ETtEUtnkt8hJuQb9v7ondo",
  "ivBnfPTyuHDNWmMSnbavckhJK6SHZW8h77nZKsEondo",
  "RTb54gpqAx6RpLAHRGnqQ3ciQ845CHqhg21ZzEJondo",
  "t71FyTYHVkPAb5g48adDHmkVxXYbUuP2eq6jDZLondo",
  "P7hTXnKk2d2DyqWnefp5BSroE1qjjKpKxg9SxQqondo",
  "EWwdgGshGngcMpDV34pWZRSu5bkAuiKuKTTHKQ8ondo",
  "aheEdmuryJU8ymy8LjYheZH5i2BW1UMsfuWQKD2ondo",
  "V8LRV7kWjrx6Prke9oHEHNUiR122BVtyuPciTCTondo",
  "kbmF7ERJWMaaDswMprrH9gHSLya5D2RMBNgKqg3ondo",
  "ucQ3VfWAx9pkCN4Kg84zE56FtB4FJN2kQH4ArYYondo",
];

async function main() {
  const rpcUrl = process.env.RPC_ENDPOINT_URL;
  const kitRpc = await setRpc(rpcUrl);
  const web3jsConnection = new Connection(rpcUrl, "confirmed");

  const multisigPda = ORCA_WP_OPS_MULTI_SIG_WALLET;
  const vaultIndex = 0;
  const vaultPda = await getVaultPda(multisigPda, vaultIndex);
  console.log("multisig pda:", multisigPda);
  console.log("vault pda:", vaultPda);

  const proposerSigner = await createSignerFromKeyPair(await createKeyPairFromBytes(new Uint8Array(proposerWalletSecret)));

  const CHUNK_SIZE = 8;
  // print chunk number
  console.log(`Total token badges to initialize: ${Math.ceil(TOKEN_BADGE_MINTS.length / CHUNK_SIZE)} chunks of up to ${CHUNK_SIZE} badges each.`);

  for (let i = 0; i < TOKEN_BADGE_MINTS.length; i += CHUNK_SIZE) {
    const chunk = TOKEN_BADGE_MINTS.slice(i, i + CHUNK_SIZE);
    const ixList = [];
    for (const badgeMintStr of chunk) {
      const badgeMint = address(badgeMintStr);
      const [tokenBadge] = await getTokenBadgeAddress(ORCA_WP_CONFIG, badgeMint);
      const ix = getInitializeTokenBadgeInstruction({
        whirlpoolsConfig: ORCA_WP_CONFIG,
        whirlpoolsConfigExtension: ORCA_WP_CONFIG_EXTENSION,
        funder: createNoopSigner(vaultPda),
        tokenBadgeAuthority: createNoopSigner(vaultPda),
        tokenMint: badgeMint,
        tokenBadge,
      });
      ixList.push(ix);
    }

    const nextTransactionIndex = await getNextTransactionIndex(web3jsConnection, multisigPda);
    const createTransactionIx = createSquadsVaultTransactionInstruction(
      multisigPda,
      nextTransactionIndex,
      vaultIndex,
      proposerSigner.address,
      ixList,
    );

    const signature = await buildAndSendTransaction([createTransactionIx], proposerSigner);
    //const signature = "dummy_signature_for_testing_only";
    console.info(`Chunk: ${i / CHUNK_SIZE + 1} Transaction sent: ${signature}`);
    // print mints covered in this chunk
    for (const badgeMintStr of chunk) {
      console.log(`- ${badgeMintStr}`);
    }

    // pause (prompt)
    await new Promise((resolve) => {
      console.log("Press Enter to continue to the next chunk...");
      process.stdin.once("data", () => {
        resolve(null);
      });
    });
  }
}

main();
