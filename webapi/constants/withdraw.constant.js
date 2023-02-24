const sets = [
    {
        id: 'base1',
        cards: 102,
        probability: 0.00048262548262548784
    },
    {
        id: 'base2',
        cards: 64,
        probability: 0.00048262548262548784
    },
    {
        id: 'basep',
        cards: 53,
        probability: 0.00048262548262548784
    },
    {
        id: 'base3',
        cards: 62,
        probability: 0.00048262548262548784
    },
    {
        id: 'base4',
        cards: 130,
        probability: 0.0009652509652509705
    },
    {
        id: 'base5',
        cards: 83,
        probability: 0.0009652509652509705
    },
    {
        id: 'gym1',
        cards: 132,
        probability: 0.0009652509652509705
    },
    {
        id: 'gym2',
        cards: 132,
        probability: 0.0009652509652509705
    },
    {
        id: 'neo1',
        cards: 111,
        probability: 0.0009652509652509705
    },
    {
        id: 'neo2',
        cards: 75,
        probability: 0.001447876447876453
    },
    {
        id: 'si1',
        cards: 18,
        probability: 0.001447876447876453
    },
    {
        id: 'neo3',
        cards: 66,
        probability: 0.001447876447876453
    },
    {
        id: 'neo4',
        cards: 113,
        probability: 0.0019305019305019358
    },
    {
        id: 'base6',
        cards: 110,
        probability: 0.0019305019305019358
    },
    {
        id: 'ecard1',
        cards: 165,
        probability: 0.0019305019305019358
    },
    {
        id: 'ecard2',
        cards: 182,
        probability: 0.0024131274131274183
    },
    {
        id: 'ecard3',
        cards: 182,
        probability: 0.0024131274131274183
    },
    {
        id: 'ex1',
        cards: 109,
        probability: 0.0024131274131274183
    },
    {
        id: 'ex2',
        cards: 100,
        probability: 0.0024131274131274183
    },
    {
        id: 'ex3',
        cards: 100,
        probability: 0.0024131274131274183
    },
    {
        id: 'np',
        cards: 40,
        probability: 0.0024131274131274183
    },
    {
        id: 'ex4',
        cards: 97,
        probability: 0.002895752895752901
    },
    {
        id: 'ex5',
        cards: 102,
        probability: 0.002895752895752901
    },
    {
        id: 'ex6',
        cards: 116,
        probability: 0.002895752895752901
    },
    {
        id: 'pop1',
        cards: 17,
        probability: 0.002895752895752901
    },
    {
        id: 'ex7',
        cards: 111,
        probability: 0.002895752895752901
    },
    {
        id: 'ex8',
        cards: 108,
        probability: 0.0033783783783783838
    },
    {
        id: 'ex9',
        cards: 107,
        probability: 0.0033783783783783838
    },
    {
        id: 'ex10',
        cards: 145,
        probability: 0.0033783783783783838
    },
    {
        id: 'pop2',
        cards: 17,
        probability: 0.0033783783783783838
    },
    {
        id: 'ex11',
        cards: 114,
        probability: 0.0033783783783783838
    },
    {
        id: 'ex12',
        cards: 93,
        probability: 0.0038610038610038663
    },
    {
        id: 'pop3',
        cards: 17,
        probability: 0.0038610038610038663
    },
    {
        id: 'ex13',
        cards: 111,
        probability: 0.0038610038610038663
    },
    {
        id: 'ex14',
        cards: 100,
        probability: 0.0038610038610038663
    },
    {
        id: 'pop4',
        cards: 17,
        probability: 0.0038610038610038663
    },
    {
        id: 'ex15',
        cards: 101,
        probability: 0.0038610038610038663
    },
    {
        id: 'pop5',
        cards: 17,
        probability: 0.004343629343629349
    },
    {
        id: 'ex16',
        cards: 108,
        probability: 0.004343629343629349
    },
    {
        id: 'dp1',
        cards: 130,
        probability: 0.004343629343629349
    },
    {
        id: 'dpp',
        cards: 56,
        probability: 0.004343629343629349
    },
    {
        id: 'dp2',
        cards: 124,
        probability: 0.004343629343629349
    },
    {
        id: 'pop6',
        cards: 17,
        probability: 0.004343629343629349
    },
    {
        id: 'dp3',
        cards: 132,
        probability: 0.004343629343629349
    },
    {
        id: 'dp4',
        cards: 106,
        probability: 0.004826254826254831
    },
    {
        id: 'pop7',
        cards: 17,
        probability: 0.004826254826254831
    },
    {
        id: 'dp5',
        cards: 100,
        probability: 0.004826254826254831
    },
    {
        id: 'dp6',
        cards: 146,
        probability: 0.004826254826254831
    },
    {
        id: 'pop8',
        cards: 17,
        probability: 0.004826254826254831
    },
    {
        id: 'dp7',
        cards: 106,
        probability: 0.004826254826254831
    },
    {
        id: 'pl1',
        cards: 133,
        probability: 0.005308880308880314
    },
    {
        id: 'pop9',
        cards: 17,
        probability: 0.005308880308880314
    },
    {
        id: 'pl2',
        cards: 120,
        probability: 0.005308880308880314
    },
    {
        id: 'pl3',
        cards: 153,
        probability: 0.005308880308880314
    },
    {
        id: 'pl4',
        cards: 111,
        probability: 0.005308880308880314
    },
    {
        id: 'ru1',
        cards: 16,
        probability: 0.005308880308880314
    },
    {
        id: 'hgss1',
        cards: 124,
        probability: 0.005791505791505796
    },
    {
        id: 'hsp',
        cards: 25,
        probability: 0.005791505791505796
    },
    {
        id: 'hgss2',
        cards: 96,
        probability: 0.005791505791505796
    },
    {
        id: 'hgss3',
        cards: 91,
        probability: 0.005791505791505796
    },
    {
        id: 'hgss4',
        cards: 103,
        probability: 0.005791505791505796
    },
    {
        id: 'col1',
        cards: 106,
        probability: 0.006274131274131279
    },
    {
        id: 'bwp',
        cards: 101,
        probability: 0.006274131274131279
    },
    {
        id: 'bw1',
        cards: 115,
        probability: 0.006274131274131279
    },
    {
        id: 'mcd11',
        cards: 12,
        probability: 0.006274131274131279
    },
    {
        id: 'bw2',
        cards: 98,
        probability: 0.006274131274131279
    },
    {
        id: 'bw3',
        cards: 102,
        probability: 0.006274131274131279
    },
    {
        id: 'bw4',
        cards: 103,
        probability: 0.006756756756756762
    },
    {
        id: 'bw5',
        cards: 111,
        probability: 0.006756756756756762
    },
    {
        id: 'mcd12',
        cards: 12,
        probability: 0.006756756756756762
    },
    {
        id: 'bw6',
        cards: 128,
        probability: 0.006756756756756762
    },
    {
        id: 'dv1',
        cards: 21,
        probability: 0.006756756756756762
    },
    {
        id: 'bw7',
        cards: 153,
        probability: 0.006756756756756762
    },
    {
        id: 'bw8',
        cards: 138,
        probability: 0.007239382239382245
    },
    {
        id: 'bw9',
        cards: 122,
        probability: 0.007239382239382245
    },
    {
        id: 'bw10',
        cards: 105,
        probability: 0.007239382239382245
    },
    {
        id: 'xyp',
        cards: 216,
        probability: 0.007239382239382245
    },
    {
        id: 'bw11',
        cards: 140,
        probability: 0.007239382239382245
    },
    {
        id: 'xy0',
        cards: 39,
        probability: 0.007239382239382245
    },
    {
        id: 'xy1',
        cards: 146,
        probability: 0.007722007722007727
    },
    {
        id: 'xy2',
        cards: 110,
        probability: 0.007722007722007727
    },
    {
        id: 'xy3',
        cards: 114,
        probability: 0.007722007722007727
    },
    {
        id: 'xy4',
        cards: 124,
        probability: 0.007722007722007727
    },
    {
        id: 'xy5',
        cards: 164,
        probability: 0.008204633204633209
    },
    {
        id: 'dc1',
        cards: 34,
        probability: 0.008204633204633209
    },
    {
        id: 'xy6',
        cards: 112,
        probability: 0.008204633204633209
    },
    {
        id: 'xy7',
        cards: 100,
        probability: 0.008204633204633209
    },
    {
        id: 'xy8',
        cards: 165,
        probability: 0.008204633204633209
    },
    {
        id: 'xy9',
        cards: 126,
        probability: 0.008687258687258692
    },
    {
        id: 'g1',
        cards: 117,
        probability: 0.008687258687258692
    },
    {
        id: 'xy10',
        cards: 129,
        probability: 0.008687258687258692
    },
    {
        id: 'xy11',
        cards: 116,
        probability: 0.008687258687258692
    },
    {
        id: 'mcd16',
        cards: 12,
        probability: 0.008687258687258692
    },
    {
        id: 'xy12',
        cards: 113,
        probability: 0.008687258687258692
    },
    {
        id: 'sm1',
        cards: 173,
        probability: 0.009169884169884176
    },
    {
        id: 'smp',
        cards: 250,
        probability: 0.009169884169884176
    },
    {
        id: 'sm2',
        cards: 180,
        probability: 0.009169884169884176
    },
    {
        id: 'sm3',
        cards: 177,
        probability: 0.009169884169884176
    },
    {
        id: 'sm35',
        cards: 81,
        probability: 0.009169884169884176
    },
    {
        id: 'sm4',
        cards: 126,
        probability: 0.009169884169884176
    },
    {
        id: 'sm5',
        cards: 178,
        probability: 0.009652509652509658
    },
    {
        id: 'sm6',
        cards: 150,
        probability: 0.009652509652509658
    },
    {
        id: 'sm7',
        cards: 187,
        probability: 0.009652509652509658
    },
    {
        id: 'sm75',
        cards: 80,
        probability: 0.009652509652509658
    },
    {
        id: 'sm8',
        cards: 240,
        probability: 0.009652509652509658
    },
    {
        id: 'sm9',
        cards: 198,
        probability: 0.010135135135135141
    },
    {
        id: 'det1',
        cards: 18,
        probability: 0.010135135135135141
    },
    {
        id: 'sm10',
        cards: 235,
        probability: 0.010135135135135141
    },
    {
        id: 'sm11',
        cards: 260,
        probability: 0.010135135135135141
    },
    {
        id: 'sm115',
        cards: 69,
        probability: 0.010135135135135141
    },
    {
        id: 'sma',
        cards: 94,
        probability: 0.010135135135135141
    },
    {
        id: 'mcd19',
        cards: 12,
        probability: 0.010135135135135141
    },
    {
        id: 'sm12',
        cards: 272,
        probability: 0.010135135135135141
    },
    {
        id: 'swshp',
        cards: 181,
        probability: 0.010135135135135141
    },
    {
        id: 'swsh1',
        cards: 216,
        probability: 0.010617760617760623
    },
    {
        id: 'swsh2',
        cards: 209,
        probability: 0.010617760617760623
    },
    {
        id: 'swsh3',
        cards: 201,
        probability: 0.010617760617760623
    },
    {
        id: 'swsh35',
        cards: 80,
        probability: 0.010617760617760623
    },
    {
        id: 'swsh4',
        cards: 203,
        probability: 0.010617760617760623
    },
    {
        id: 'swsh45',
        cards: 73,
        probability: 0.011100386100386106
    },
    {
        id: 'swsh45sv',
        cards: 122,
        probability: 0.011100386100386106
    },
    {
        id: 'swsh5',
        cards: 183,
        probability: 0.011100386100386106
    },
    {
        id: 'swsh6',
        cards: 233,
        probability: 0.011100386100386106
    },
    {
        id: 'swsh7',
        cards: 237,
        probability: 0.011100386100386106
    },
    {
        id: 'cel25',
        cards: 25,
        probability: 0.011100386100386106
    },
    {
        id: 'cel25c',
        cards: 25,
        probability: 0.011100386100386106
    },
    {
        id: 'mcd14',
        cards: 12,
        probability: 0.007722007722007727
    },
    {
        id: 'mcd15',
        cards: 12,
        probability: 0.008204633204633209
    },
    {
        id: 'mcd18',
        cards: 12,
        probability: 0.009652509652509658
    },
    {
        id: 'mcd17',
        cards: 12,
        probability: 0.009169884169884176
    },
    {
        id: 'mcd21',
        cards: 25,
        probability: 0.011100386100386106
    },
    {
        id: 'bp',
        cards: 9,
        probability: 0.0019305019305019358
    },
    {
        id: 'swsh8',
        cards: 284,
        probability: 0.011100386100386106
    },
    {
        id: 'fut20',
        cards: 5,
        probability: 0.010617760617760623
    },
    {
        id: 'tk1a',
        cards: 10,
        probability: 0.002895752895752901
    },
    {
        id: 'tk1b',
        cards: 10,
        probability: 0.002895752895752901
    },
    {
        id: 'tk2a',
        cards: 12,
        probability: 0.0038610038610038663
    },
    {
        id: 'tk2b',
        cards: 12,
        probability: 0.0038610038610038663
    },
    {
        id: 'swsh9',
        cards: 186,
        probability: 0.011583011583011588
    },
    {
        id: 'swsh9tg',
        cards: 30,
        probability: 0.011583011583011588
    },
    {
        id: 'swsh10',
        cards: 216,
        probability: 0.011583011583011588
    },
    {
        id: 'swsh10tg',
        cards: 30,
        probability: 0.011583011583011588
    },
    {
        id: 'pgo',
        cards: 88,
        probability: 0.011583011583011588
    },
    {
        id: 'swsh11',
        cards: 217,
        probability: 0.011583011583011588
    },
    {
        id: 'swsh11tg',
        cards: 30,
        probability: 0.011583011583011588
    },
    {
        id: 'swsh12',
        cards: 215,
        probability: 0.011583011583011588
    },
    {
        id: 'swsh12tg',
        cards: 30,
        probability: 0.011583011583011588
    },
    {
        id: 'mcd22',
        cards: 15,
        probability: 0.011583011583011588
    },
    {
        id: 'swsh12pt5',
        cards: 160,
        probability: 0.012065637065637071
    },
    {
        id: 'swsh12pt5gg',
        cards: 70,
        probability: 0.012065637065637071
    }
];