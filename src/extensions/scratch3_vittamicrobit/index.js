const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const cast = require('../../util/cast');
const formatMessage = require('format-message');

const localisation = {
    availableLocales: ['en', 'fr'],
    messages: {
        'display_show': {
            'en': 'show [VALUE]',
            'fr': 'afficher [VALUE]',
        },
        'display_scroll': {
            'en': 'scroll [VALUE]',
            'fr': 'faire défiler [VALUE]',
        },
        'show_icon': {
            'en': 'show icon [ICON]',
            'fr': 'afficher l\'icône [ICON]',
        },
        'show_leds': {
            'en': 'show [MATRIX]',
            'fr': 'afficher l\'image [MATRIX]',
        },
        'display_clear': {
            'en': 'clear screen',
            'fr': 'effacer l\'écran',
        },
        'display_lcdSetText': {
            'en': '(lcd) show text [TEXT] on line [LINE] position [POS]',
            'fr': '(lcd) afficher le texte [TEXT] sur la ligne [LINE] position [POS]'
        },
        'display_lcdClear': {
            'en': '(lcd) clear screen',
            'fr': '(lcd) nettoyer l\'écran'
        },
        'io_isButtonPressed': {
            'en': '[BTN] button [TYPE] pressed',
            'fr': 'bouton [BTN] [TYPE] appuyé'
        },
        'io_isPinPressed': {
            'en': '[PIN] is touched',
            'fr': '[PIN] est touché'
        },
        'io_buttonPressed-is': {
            'en': 'is',
            'fr': 'est'
        },
        'io_buttonPressed-was': {
            'en': 'was',
            'fr': 'a été'
        },
        'sensors_getTemperature': {
            'en': 'temperature in [UNIT]',
            'fr': 'température en [UNIT]'
        },
        'sensors_getLight': {
            'en': 'light level',
            'fr': 'luminosité'
        },
        'sensors_getAcceleration': {
            'en': 'acceleration (mg) [AXIS]',
            'fr': 'accélération (mg) [AXIS]'
        },
        'sensors_getCompass': {
            'en': 'compass heading (°)',
            'fr': 'direction de la boussole (°)'
        },
        'sensors_calibrateCompass': {
            'en': 'calibrate compass',
            'fr': 'calibrer la boussole'
        },
        'actuators_setServoAngle': {
            'en': '(Servomotor) set angle to [ANGLE] on pin [PIN]',
            'fr': '(Servomoteur) contrôler l\'angle à [ANGLE] on pin [PIN]'
        },
        'radio_dataReceived_string': {
            'en': '(radio) string data received',
            'fr': '(radio) chaîne de caractères reçue'
        },
        'radio_dataReceived_number': {
            'en': '(radio) number received',
            'fr': '(radio) nombre reçu'
        },
        'radio_dataReceived_bool': {
            'en': '(radio) state received',
            'fr': '(radio) état reçu'
        },
        'radio_sendData_string': {
            'en': '(radio) send string [DATA]',
            'fr': '(radio) envoyer la chaîe de caractères [DATA]'
        },
        'radio_sendData_number': {
            'en': '(radio) send number [DATA]',
            'fr': '(radio) envoyer le nombre [DATA]'
        },
        'radio_sendData_bool': {
            'en': '(radio) send state [DATA]',
            'fr': '(radio) envoyer l\'état [DATA]'
        },
        'uart_sendData': {
            'en': '(uart) send command [DATA]',
            'fr': '(uart) envoyer la commande [DATA]'
        },
        'uart_sendDataAndGetResultAsString': {
            'en': '(uart) result of command [DATA]',
            'fr': '(uart) réponse de la commande [DATA]'
        },
        'uart_sendDataAndGetResultAsBoolean': {
            'en': '(uart) result of command [DATA]',
            'fr': '(uart) réponse de la commande [DATA]'
        },
        'uart_onDataReceived': {
            'en': '(uart) on data received then',
            'fr': '(uart) si donnée reçue alors'
        }
    }
};

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPgAAAD7CAYAAABHRVmlAAAABmJLR0QA/wD/AP+gvaeTAAAkd0lEQVR42u2dCZgcVbXHRx8uCCq4IJAYkunuSWJ8iOCCiBoUwYVFkKggICRhpqo6gwQiix/wEkGCCDxZBALJVFcnQQmoLMoqBDSyhReWGCRhTwhhTQgkgay8c6qqu2t66tZ6q7q6+3+/73yBnu6qurfu7y7nnqWjA6XtyvDyhGH5knomyVySV0g2kqzLldQX6d+78rp6QUHv+Xb+4t4PoLVQUJoF7BljP5zXld/bQL8bQNaQ3FQoaYcDdhSUDJcuQxlEsC4ICLabrCqU1Gn5UnEUWhMFJUNlyGx1ewL06RhwO2ULyQ00YHwJLYuCkoHCQEqCu0602/Nl9RtoYRSUBpWcoe2TDNwO0dW7SfZEa6OgpD17G+qdiQNeW7pf12kUu9DqKChpzN5lZQeCbnNKgFdkIyvjRs7s3glvAAUlydlbV8YGAHJl3tCm0r9T8iXlWpJlkkB/K69rk0fN0bbFm0BBSQLwktrnC6JRPLjfj97teE+uT9srpyu/o7+/JkER9xININoe07rfhzeCgiJ1Blfv9wHwZQZa9PvBcyZuTXv48bTkflTCjL6EQD/M634oKCjhZvA3vLXfyvVBr1UwlANoNp4vAfT7Osva3ng7KCgxijn7+sCWM9Tzwl63y1D3pd8+EBd0snu/g5SAn8WbQkGJUIZdNf5T/vtv9cRIF6dltqQZfQPbxrO2H28MBSVE6dR7Cn6AFXRViXUTAp005QfStRbGBP1N2uefvmt50jZ4cygoQfbMZW2kP+DaMVJuNmfMf1lHcnGP2LSXCiXleHiuoaD4lNxMLR9gH9wt856j5ox5f8HQfs6eZ/FAV5aZ1wHoKCiCJXq5e4jvDE6zZRL3HjV93MfoiO5cusfbMRVxz5qDEK0Q8EZRUBwlkJJNV05N8hm6+tROAv2Ptp16nD36wpyhHIIzdBQUu7DlmD9Y2vlpPAv7jtOy+x4JZ+gLyMLuJ6PnTt4Kbxil7YtpZ+4NzMw0n8c6Q1cek3CG/izv0Xee1v0hvGWUti1kyPKEn7FJ2s/Esy+doffQ/VdImNFfKejKGSOM4sfxtlHaorAmm/bWo22Ls0U+gDzN3+Moq2k/J5950/1PC7DKCBQckp1jhk0v7oIegNLShTTjZ0cBZKh+zAcb8bxmvDjLXXWtBNA3mEo9hJFCadllua5dEQUOPtpqqL6gr/eT9tHaO5L80ReTKe4pWL6jAPAMAF4pfLRGJrSlELHb/WQtgT6b2uU7OE9HAeAZKeYZuqFcSc+2XlY4KTNzC2Vtoet+Hj0FBYBnoJgGO9bSfZ3U2HGG+pyZyIGcZRBtBgWAN7gM1bUd2TDHTqckO1Ak52cz6PThqOEzJuyMXoTSmEJ7yC5d/Rp7brGNtptEtxjTJoquydZjWYmS2nV19yfYtZSeeXmCkWEfJ7mUYsr/OF/qzqHjoSRe8kbPV0zNcLohkOuPoC7IynKWn4MHHhqY7k2h7ivZKIiP80gBeEShXPwyDzTS3i15zbFegLYNR9rbkeno8e0Ed19xd0nnxDLEyFr7dOraF9nsVqZCLmhCRpKHOLadGcGW0y7z6oKiyLquruhzAvl/eHXASSLos3+YwSgHnhhskTmAoGR+9lb/lRG4TeFtQmb36RZAS7PUXtHSQWkHoue3A9yzegdnrwNql2S60SZPfi894365knJ1XJ/0Bso56P1tUKiTfjWDne+mZmm/ofoJ2xHs4+iZb5NoPJPCDK7ejd7fDjM42VVnsAPe0oxtaWrgTU82Snuc/n49tAUezucBOACPWIbPGPthCjp5KCm+ZkhyXZUuneWeL4AAAA7AZczuZBprabrVclaUdEnFzEMB4G0H+IB2JwMX2geP4XNp8wxcSiLGEDbzJfVmMlr6EQgA4AA8pcKupwT8nrmSdrTpd8+zva7eyskZbSg3BWy/N6zzbzbSUa4lRepvePXAwTf4qA+9HoAD8IwWDpzBQSzYSYaX/VUhBR9/DsUZCgBHQQHgABwFBYADcBQUAA7AUVAAOABHQQHgKCgoABwFBYADcBQUAA7AUVAAOABHQQHgABwFBYCjoKAAcBQUFACO0qhCGTW4oxV05Qw7Nc4N7ASfBeFn8nr0XJ/2aTN2tRy5jCN2egJZUv9S95ui8NkM9bwA91ycQcBXS2xTiI+Qv/k/2W+cQilPpmwr+0hzOe0ylEEE0eVpRrMIKQs6p3V/1KsOneXuIZLutSRXVnbwnXGtQPaV38zjrBXucGu/avrY3ZBGycsccMKv74s7qZlKRZsqPaOjXAkEHH9Hwr1eGDa9uEugtqsATtkrRc+X09VedFKIFNApSmyovOd2WJq7M16xF0boytBAwM3q/UjMe72W7+v5TODB0QL8rWGGuqvb3wsl7XD6+2Z0TohEuS3QbM5ZNGhJ/mzGKxMOOF6NxIhNzYkHQq1+eM9MwfrcFWbK/k0QjxvShGLGhSN9k7Bjciwp+tKDWQ8GT5XYyx2s7pxoSRxxxtxASrDveugm9nC/l3skTM5ImVBuawikmvZYOJOb2RGz/fDvcNRJt2fnpO3092cKZW2koG5h81NtIbh/5go3Bc+jvy/KG8WDg87qnXpPgfdL6ICQFFIe3TpgT877xYzvCzeJlr2jpo/7GP19oZn1ckbP5wSArwqZXG+ieD+vzbeUaMEAt4/plqLzQdKLq65Nqgfg5gw/8BY6ez/ODZ6dp3V/yDyKqqR6oTzRAsADp6bh4yu3awyeM3Fr+vvc6ncDAG4qLGnZhE4HSTtveTW/uMRz4oSUB9rJYuWZmUTOMXK5K8T4yCoQ3GTE4/Z7Niygv9/Y7/s+gO9anrQNrTruR2eDNGQW15XfVWa3Yob3E+cKLetK2jUus+8+AouxJ/zvpVzvep74bsd7XPUTHoDbA8LN6GiQBsoaTrDIgN+Q0QecznAJgLvK9Td0DCWYwR/xudddfIogWN5f6vobEeBkymonnkcngzRWDPXIjoqCKlszt3L96LmTt/Kw3xb8TjtQAOkDXueHnCTe3SiF8k8JG88d8IKhXozOBckI4OWOzB3fGOqdwtlUV071Sbf6Q8HZ9D2C3zzFOaRcB5KScpL3cw4EnAaL09GxIBmShQz4hgw90AOj5mjbugNHuZtJo+6jkDtcMIPf5vL95cPLE4a5f18b53evesDZJhgdCpIxebsjQ6aTi8WWaMqPgqRmFRmnDNCAU/rWgq7t5r5f1w4LlAbWAXjg30AgKUtHRjzGlvJxnbtZqLovW7EFPOY6TqBkm+P43rouXf1a3HtVAGfNfeDfQCANAPzNBj/EK1169wgP++23QlyrKAC8XLGIyxnKIe77e3XPUPciwDvLPV/IQPtBIJ6Ar2rgA6zO9xV3dwPONp9dKcXE1DpW20JKurGuMzeZuIZth4Ku/oIHp+Z40cpjvjoFSMsC3qhoLesKpeLXhZ5hJfXFCBr4UwRKs0tYKy52BNFeivD8G5vkJb/DdaT66+jwbQl4pM4d23mElFyHenmGRTJrFcRnE3mZ2W6fz7byC6b6neWIbLMSnb79ZvDlaTuP0Hnxse4+6SdsR39/OHJnFjiKeLp9tvYLXso28TUjIWUCOn37AZ6uK6OhnhjEM0yq7bqX22crz971CkXThl9dgI7fXoA/k+INp7j6dM8Z83762y0SlEkX+sFtun1mP+acBNFuF/in7wWFW3sB/mRKN7ssjGdYRLnUC27by+umNnix64fPUId7xI3rQ+dvE8ADuVLGVvQoV7smDGDPMEO5Ut7yX7lSSHcbeXmxk0yAQBSvAYD2mMH/nfRSURz838MzLJoYHrPWZW3yUp9nfUaA6K9FANAGgLO7ZII3uM+pxa3rYKclslJwty+f2i4vVHT86LaiaYIouhAJM3hCWlXlsSGz1e2jeoZF0xqrfxpwBm5ZnLXHC+WImmFiuBs9X4HCrfVn8CRG8adGzuzeyX1ZrhySoOfVjXVbgJ+1UQf2VKxB4da+M/h9ki8q9LMO5a0VTW5JaSDJ4uz96yh56KBwa33A50m8oNDPOoJnWKRoMCkNJJm2WIswi0Ph1rKAyzP6WNtZ1vYWZPj8LP399eSPhyiPsuX22VYpgkShqgIXKNxaGHCa9SRcSJjHK7JnWMTtQYPdXxsht8nIBW8PjMh62oLeZLfHvMhmcvL4sWzPMEgwxZooWEYkyA1tBtq09fbgN8dcHh7v6mdNWQ7jeIZBAsk5HRILFG6tCXgc2+zTRJ5h5n4YDZxklJZlogi0MWdxDW3bUko25fpIMzcF+E/WMwzifWKgHdaRRCGFW94jUQSk+Wbw6yL8cKZrWiG5nmEQcZSWOzoSLJylFQq31lGyhQXyBte0QrI9wyCpKNY8zsano61bwV00nAvlXFFaIbrOb9CgqSzNp3akUKBwa51z8HJAK7FHREn6kvAMg6SnWIPCrbVncD3AF5eIk/Ql4xkGcbe159DQniKI/T7Qy07bjU46pnmJvUyPGh56jZlRRpagj0VWsk33mzWGTS/u0gDPMEg0c91HgwBuv7skn+UZyToB9LNIM7iuXeHxhVfFMcXbzqEDgAPwpjwH/73gj29y7q2GeYZBADgAl7EH1y5yO4qh47P9GukZBgHgdYBvxPuNtAdXLqz7cJPISiplzzAIAAfgEkI2/dbxAWkqtXHwDAPgALxlzsFrEUdpuT4JnmEAPKOAb8D7jTSDK2eb/yOI6QXPMAAOwJv7HHwKH5XBMwyAZxzw9Xi/EQA3j8LICwyeYQAcgLcg4K4FnmEAHIC3LuDwDAPgGQQcVpMyACfLtlPRMAAcgLcg4G2W6geAA/D2AZyOycbA3je2bLGSLyinsjMOR17hfGEcM55PK0geB+CRAX8b/Ssi4Pmysj+UGDGFM8QYyuc9eykpLzkLCfk3PwfAQwO+Dv0skiWbmUJ2DRojZhglikYaKhySnIwyABzia+gyDw0RR7Tzo3RYThaYl5/ZtZUBX4u+Fglw7V40RGR5yNVIKGDhNMuyV0/ZAVxZ1tWndjpFlDNe4LW4h1OwBwfgqUtnqfit+En/tMktOoMPkKDx3Ol7f0X/AuCNliddkz+ELBzMUqYjRYsAfgf6FwBvqFAnvFzi/vI+AA7AAXi2AO+WCPilAByAA/AsAa5r35EI+BQADsABeJYAJ+s0WYDXhc0C4AAcgDfc5ttQeuTN4Mq1AByAA/BsGbjMkpiP+1UADsABeLZkNQejlLD/Pgjn4AAcgGdTk35WLLqtsFjz2wVwcrT5e8BB7y70LwCeBVlPXmR7Rlau6coZLWyL7uZx98eASscH0bcAeFbkFbaVDgt3UmmXMw14SS0GnMEXo18B8CzJWlEuN4HWXE0qck6GAV81VD9hO7/nGqof88E8YqAD8Azux18M4lnWdXX3J5L0jMoo4FsKunpEkOfqMpQvoT8B8EzKUF3bMYD32IFtErKpIutE+e7S8K4D4ABcnszqHezfgc3Yd+0A+FvskMN+4CGPDZegLwHwbC7T+7RP+2vOtUNbGnBDfcTUMczq/UhYxWOn3vM99CMAnt0AEOXuIb4zlFE8uAUBf54y017UWdb2jmwTwNl0SuoC9CMAnlkZoStDfWdwQzmgBQDfTPIA75fN3HZSHG6U49GHAHimJch+kwD8fpMC/jpd+w8U8/2oXFnZQWpARQo3nUdiAwDeCoDLtj1PGPBFpBQ8l5M47DGt+30dCZTcTC1P91mO/gPAs69ko87aaO11TMBXk1zHx1rDZ0zYuSPhki8VR9H9lqLvAPDmULIZxS7/5ah2WMYAX8UKMlp6j05qlna/v5kHDwk3AHjzCOch87dB147OAuBsMUZhp47jBAwdKRbeb7NXGfoLAG++KC9lbaR/B1fHZwHwVAsFteAYdna8883oKwC8OZVsM3o+5z9zqvu2C+Csbaf+NRHWaQC8RSzZlG/6dfrBcyZuzWacrQo41y9naD+2Z+uN6BcAvHWElt8B7a3/t5UAN2dqXRlbKGl/huIMgLfuDK5rVwQBYshsdXv6/lPNCjjHorMs8rTz7ZBT2FcD8LaYwZ8Lmq+MNe70m2eaBXB+XpqhT85b6aY34X0D8Hb1KNsrKDQjjOLH2aVSppmmTMA7de2LdF59HkIoAXBITa4LCxKHMuI9LP12btzlblzA2SOOViK/pGs9jncJwCEunlZxPKzYp5xgPzWq62QUwNmCjXy4fypjgIEA8HaQh2SYfQ4vTxiWKykn0Yz6r6DghQXccvZQHsM7A+CQUKJdIlPJRaalg3K62kveXXd7KbnCAD5yZvdO8OQC4JCoQkvtJDTaw64a/ymKUqrYNt2bogJO7/4avCcADol1dKZNDRJOOfLMzmGY2b5dV2+l+20ICrg9e+O4C4BD4h9dKX8P4iset7ABDTt1BAyR9EO8GwAOkScb2O961Bxt20w4glipk/BeADhEsnAEkyKn6Gko4OQLjncBwCHJyXI+AmNrtkYAzmGZ8A4AOCR5eYfT6ubLyv6j507eKjXALcs5tD8Ah6Qoq/joyoxX1tf7ySQBpwwrx6C9ATikgSavbBHHyQWChIKKGPQQ7QzAIRmRRSRnUv6ugqQl+lFoUwAOyeS5uvogxzpj89Xo0U3VI9GWAByS+WW8ck+hVPx6eC266T2GNgTgkKYAnXy4sUSHAPBWXrqTA0pwS7ZkEzBAADhEvqwZqms74pgMAsBbdhZXzgjmbKIei/YC4JCmE+UemKpCAHiLCnmJPRvwmGw82guAQ5pOtPkB9+CHoq0AOKS5TFuN/KzewYHU6JSggSEnk9Un0HYAHJJloairBOtuUSzarJDJajGPnGIAHJJJs9Vpo+aMeX/s2G569wjqC/9BmwJwSHbkTNkBHLFkB+CQjMzciSQZpGQLdP0VaGMADmnUURjPshf3fiCxeG2G+l20MwCHNEa25Axtn8RDOhnqHLQ1AIekvTQ3tL+lEnXVzFmGRIQAHJIy4MoBKcZOvwNtDsAh6cnrSaZBQtw2AA5prJ35X1NNjmAt09H2ABySjsWa8j/pJ0hQX0PbA3BIxiK2SMyAAus2AA5JCfAj0gbciuCKtgfgkBQA145pwBJ9AdoegEOa0PY8IOCvo90BOCQdMdKEu3Na90fR5gAckt4x2YscqCG92Vv5EdodgENSlE5d+2KKy/OZaHMADklXrkoDbvYNp3u9ifYG4JB0ZUNXn9qZgpnqeWhrAA5pjPwl0dnbDN+krkU7A3BIw4I+KBOSgHuofswH6foPo40BOKSx8g5ZmX1fJtwcvJGW5n9C2wJwSDZkfd7QDpMB9+A5E7em692ENgXgkGzJFit0srZt5D23oXyJrvM42hKAQ7Irz5AhTDfvoQNbqhnFLnJBvZJ+uxHtB8AhTSHaSzyjsxVaZ7l7iDP6qml62lfcPVdSTqLv3pZHzDUADmkJWc1KObQDAIdAIAAcAoEAcAgEAsAhEEjzAL6Ornk7HdlczlFAcyVtUl5Xz6V4YiX627+bpGFWFEran+nfcyiFzymsdSbN9G/pv8v02VNN5kP+LL2Pa+jfs6hOJ7PQ+7iA6vMH9i9vsg77Jmd2sU4J1Cn0Pn5JpwUX0vu5mv5/aZPUgfhQ7+LgHSYXJeVs9hC0jYxezyrg67mR2XSSLaI8vZT6tE+T9ZVGL+b/Mtbwb1FbXNJZ7vmCr2EIeXNR5zqRfrMoo53oVR6c2GnE12usrHw2r2uTqT7PZRVqkstyfco3/fKgD5+hDmfoM5gCeR1PcJzU0ZMPSmrB/v7Ex1RZg29cwNeQnDnsqvGfipgaZw/2jGo4DNQphsxWt49Uhz5tL/r9nZnoSBakxZ2ndX8odEUmT34v9YX9MjTwLucw0cNnjP1wpHBTZW1v6l//aHAdXufVX5S+NXru5K1yuvoDusbChgDOS1iejaVEDikr+9M1l6T+AnT1j/m+3k/KycapHdbAZeLmgqFevGt50jaxK8Kg68pYexXQiLps5C1EVLAHvBddHUPXfCHt98EWghw0I+7z26D30jVXpQX4xiQC8PMLpWvfkJ4nlna49BBHNFjQDHhPyp1pJS9fZddlhK4MbYDb6KuFUvHrsuvCK8wUZ3PeUhyUUBqpRUkD/kZnqfitxCIN0OxhKrMSBiKJTlQpe0zrfh8ty/SUOtPz+b6ezyRVF17q0z1uTKkujycZqYbfi63oTfR9dOoT/juxGHmzej9CK5JbkwJ8fRC4zVnMUMfndOV3nESeE+bldO0K+v1pvOcOuDe/PCllR5CghfaI323WoaRcW60D7dVNJZxfZFNSltha+CQ708vDyxOG+a+MJuxMdVDpNOMi29f7JrN9deVUWkZ+PlAACF29O+G6LCWPtkFBVhWkRf85K0Pp+a+v1IVPBgKBlex7eS2IUpMVgTTQ/IIVh/bgyXIpK23Z+SfYoBt8Ug4OuKEe6Q12cXf63i0km/y8nvgl8Yjq9SISmDm2+PlOmxpMOuLzrQMps0yHDYcjh7t/dWI2Bm+zcs97kFS+St+bG8Ch5GmODuP1Puz46EmdGLyRLxVHeaZP0nu+TYPM/QGutZgG4uO8UiybA5ah/ivt90FZaQ6l+z7ify3lMXP76DGJjDCKH+e6ygTc8Gow+1xy88CjGuUxbkzrLHaAS+IS1nT6RPV8Rd55sHaRJ4yGNsOtDlS3R80OYWmo6+vwNM0ko8UDRk/BPveUrRw8wVOXYaizzQGtbsa39tTm+15aP4iZR0tGz1e8Bz/5bqVe6ZhGTR/3MYFeZjnVY75ZF+u91L+3f/OE47OfXSvx9OIUD1/7QfZA23+yKSnLzEHLHLjovwe+rwe8ZnT63Z4BJtNAgK/ghhaNJATAP/sZItDB/TBD3bX+u3xUQBX5qfViasouAu9oceI77XBZS0CRVpbOgXegv9/nnFFyhvYrPh9263D8vPn++bo2mLOGcCYlQx+57qDzRTOU3ZmcirHXCrpyhtvS0dxKWdpyp/HR2/yOPDrVuZIBv0Uck707VzdLreC2dNuW8Dvkd1B3/r2GViaHeGRNnSjrfbCm23WrRxzY8NZWfqwRn9U72GV/PZhXUnX2CK97KVDZyCc24LwX9Qjx85BjaXFtoCMnWnrYkKypRSQRa7R5JIs9e+vKT9yuzcdK5gxdPfpT/8CDVoijpHV+MxEvfWUenxXKxS97LKOdQPQN1U/YLsi+lM/OzfBPldmFjpY8TjpWyTpKEs1QrANxgsG6kCBHgOaRkuXrXllpbCLwvyP6rgzjHtHS3DSGqlmmbeFJw2tLV+3v9B3TSq82o78teuem0s3c4kQH/GWR5Y1ttllZ3p0XNqUOAbGb46x1rUjhEzt9Dr1E0QhrnoPXBrKzwtbBXraurLwIDn0k2A+fJMns9B9iIxVHPDVSoIUPlax+zbLms2Y/t1WYfd4/VRLg14kHxOpR45aCofSErYu5ZzdXI+Y1VvFWyfV7psIuVh3mBZg4NnEfjmhXURmolo+c2b2ToG/9JjrgZMLoYZhSnfWi5svKl9Vv8BK3sudwu4450saYARkuwcrgoNrsq5aiHl3YnanyIh5m2AQj7RoJ+9VDBYPgTx1w/z66sU7x4Op+lvQOYq18/EgwrAQUvJdirW8pZ0eui7NNBFsBjmOXj5G9hZ7vh4I6TAmiL/HtWyXleD89mL0t2xQJcNdRnCB0LJtXRjXxdMyiF/g1mH3MFuklcNgi1xmvptF8Oa7VlHnMURssjhDMFn+LCcVatyWevQV4qmqqGmAZ6FMXw3HPgwT71/lxnXncBnN722dbnWn/Ea28QtTlL7WltPteNsZpzdtuJsG2cni1/Z374iaLtB1TLGtFWvWG3cYKARdlsrSXchVz1ZNjW0xZKv81dge90xVwUpZEfAmL3Ec9dd9qHWiZJsNSyrEknJfEcpDP4v3bRhsXuy7Ti7tUZwQyqhDMLGfHBLzP/brqsX6DfTjLwp7PONrmGr8VgwwFIWvUHaup0XHr4OSNz//d+wDt78MDrlwtGL3PryoOJNmiO4Ltb3BbEdijYoTjJPflqmkoYY+KQ3VtRyl1IAAr13RzvrHtBOIc801y3yJUrbM2BFKqBVveVvbA77itbpxbtIh1Odp9NWcar5iefWGiw3pvO6ortdVu3mhsICPzaMzB03IpqZ6tFXNli/q82zXZAC3KDH6WYJR9tLKEkmWCx7bttRlVOUAw0kbYK2kTBQPKE/ZLekRaHZwztItBjb1SiXESoP5A0C7LvVYO0fZ+6um1+w7UQtu5y96Nvm1ysX+wOvIar9VKxLrUTJ9dzvntk4EotghjBLqWzX62IxGW6X21e3fnBEeKIffgZG4quFllf3GbrAqQlvN7jj2sIrhv6MD8ruegVkeqLKdvlFWHfktlgWIljqLNbf/FM1LlOEW04oq2GjGPMYX9wLZRj75EdzsHNh11qpPL5dLqYnliCaGs69OBxe3EhC3y/CbIaHoq8tev3JsU04KjtS2ugPNozDbi9eK23Kt7sddJA5xGdD/NPdvwuj2nl7hl+7AMbqqdd7a0OjiXSWQQIjJ8CFuHWl1clpcc97xaF+VKiVD8wHFKcrr7/pbjq0eri9tJg3OpzLOuvIFX/ZljFdQrOGr6Kutlwojb8XG/PuBh3RZhm3Gin00H7cP3cXvOcDdyjBRswSZvhDJ9disz+C86Eiz20UhFkfN3iS/hyFodlDM6Uij2kVVF33B9Elsm0TZHdimUtZFBTKPD9y1yqqm10dgk62Af+1YMvy5MYpsh2sLKqwQdcdg3e8VtJI54zTP9RijJdagYp7wgRRFiDVK/dsxAx6YBhW3gUrFAWyxxiX6Rlz4hidJ/dUjmuPLetVEbeHu+neiAS2a0QcxwYyhw3+2a0fO5ZEdamvX8jBUivASHyau3Z5GkEfGfNYWPfwy2gHVYKPuaAe9btT0P4q4Y8JpPVq7JW6MU6/J01VzWZZ8eulhmuNXINLJOTHwG3Irp6DusdJO04qzojNbLOl3w2NPUztxkKHZsr5iKgmC1rFWB94hYM+/j4Axyl2bqOk9XWPlQXOZ3ThpV4ckrHVkrnGB10WbJsGKrXc9hzUZGQCnV4XaZ2xtW2Dp0O/cnXgGODOl0exMZwocYYec5NI93pPESnEok06gjQOADUWFrK1oRPOhnn5xYh9KVo5yebXFmcUsrTy6+CSwzAw5WTqOTtWx0E/VabA9uuylX4++lVIcp/YJAxIjLZh+tvhrE5dlrxLk3zNGAi5niclb2RBwsznMzj7XvscEptpb1ofrP7aOJBQM+t6yYHq7/3FLm9OvEVuzwiMEX++1X+7WTeazX796Wh5H2H+dn9r5tsfMz25psSb/6WxrzJ52fsaFRv05s+3VHNXix/fr7v3erHZf2u6/lYvtCv7pZxkjLnZ9xB7XD/1Y/s328V9S3jX26sbLu/g9HCiRpHoVq17i8l0G2N1y/e9smsm/Uf24Gh7DsL/p9bh9PvlX/+R4ux4e8HfQL9yyeOGrb4YrY9w56nLdJBuAsC4OED6rbq5wjsn93i3zBygWna2d1v2uBPyC0rBnv2zXRAg8I/QGvGL242q17rD5E8eNswF0SJJgGCU/3+y5BXw+pGfCwzpXRhv75ejv7+t9WHHdE3keizuSw7nMBXHup37NYprn9g3FY59j9IrHa0L/Wr27WrDQgwL8N/kqXCCf3hBl8bShnCt7LILdAD7aCb0BgDhv8gVlZrdOk9fWf71o+ahuRmXGY/bhtfONqI98owK3oJ3S84ucgYIE6cGRqOOCVqCdk2OFXB9Ps1CNOWQYAt6Ke0PLdT6fBWyzPEEYNB9wy0TRPV3z0AexQ4hUJtlGAVyPm6NqBvqsoOgbzStzQSMAdwfcp0gRVhqE0g8xRFFM2MuA9tp+rYYMBr8aNY5t7bmx+nkodTHNUK8nBZv92ajjg1dBYbHjDyjNuq0pdTOMJa5Da4vn7bABeUVrx9uacSl342Wx33dPq9CCZA9yxZH+UU3qxPb/VR6k/sm0/fxYgZlvjAY8pGQE8lmQM8HiSKcBjv5eGAx5XADgAB+AAHIADcAAOwAE4AAfgAByAA3AADsABOAAH4AAcgANwAC4P8BB5mgA4AAfgTQX4xn6+pgAcgAPwlgL85bqAbgAcgAPw1gFceSxUEjYADsABeBMBzjEH+weHB+AAHIC3DODsbDQwZBIAB+AAvAUAf6OaRITA+T4AB+AAvHUAHxDZ1xkPC4ADcADe1IAvGBC33ayMz5k4AAfgADzrgCvLhLHsvMLdBAB8Bcc7CxT7i9Lw1L/4jAC+1C33kzCqi0tHzRDgS7hDB4qkamWWeTOzgFN/CBq8kJ51v3wtzHCWAJ8XNE21nQhkY3jAtXsDheoyI6e6QSYGPDDcfpA3EPDAcPtBngHAA8PtC3mjAQ8Btx/kDQR8Xtgc9CLIBYC/ECTUmGsH5iRqnCfa7LBmhx4AeGi4vSBvEOCh4faCvMGAh4bbE/JGAh4Bbi/IGwR4aLi9ILdDWy+j/57LEX05Dp0X2P8PtYUSTonb30UAAAAASUVORK5CYII=';
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDguMjEgMjUxLjI0Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9PC9zdHlsZT48L2RlZnM+PGcgaWQ9IkNhbHF1ZV8yIiBkYXRhLW5hbWU9IkNhbHF1ZSAyIj48ZyBpZD0iQ2FscXVlXzEtMiIgZGF0YS1uYW1lPSJDYWxxdWUgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB4PSIzNy4yMSIgeT0iMjI4LjI0IiB3aWR0aD0iNSIgaGVpZ2h0PSIyMyIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTS4yMSwyMzkuOWMwLDYuNjUsNC41NCwxMC45MSwxMSwxMS4zdi0yM0guMjFaIi8+PHJlY3QgY2xhc3M9ImNscy0xIiB4PSI0My4yMSIgeT0iMjI4LjI0IiB3aWR0aD0iNSIgaGVpZ2h0PSIyMyIvPjxyZWN0IGNsYXNzPSJjbHMtMSIgeD0iNDkuMjEiIHk9IjIyOC4yNCIgd2lkdGg9IjUiIGhlaWdodD0iMjMiLz48cmVjdCBjbGFzcz0iY2xzLTEiIHg9IjU1LjIxIiB5PSIyMjguMjQiIHdpZHRoPSI1IiBoZWlnaHQ9IjIzIi8+PHJlY3QgY2xhc3M9ImNscy0xIiB4PSIyMDYuMjEiIHk9IjIyOC4yNCIgd2lkdGg9IjUiIGhlaWdodD0iMjMiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yMzcuMjEsMjUxLjJjNi40Ni0uMzksMTEtNC42NSwxMS0xMS4zVjIyOC4yNGgtMTFaIi8+PHJlY3QgY2xhc3M9ImNscy0xIiB4PSIyMDAuMjEiIHk9IjIyOC4yNCIgd2lkdGg9IjUiIGhlaWdodD0iMjMiLz48cmVjdCBjbGFzcz0iY2xzLTEiIHg9IjE5NC4yMSIgeT0iMjI4LjI0IiB3aWR0aD0iNSIgaGVpZ2h0PSIyMyIvPjxyZWN0IGNsYXNzPSJjbHMtMSIgeD0iMTg4LjIxIiB5PSIyMjguMjQiIHdpZHRoPSI1IiBoZWlnaHQ9IjIzIi8+PHJlY3QgY2xhc3M9ImNscy0xIiB4PSI5Mi4yMSIgeT0iMjI4LjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSIyMyIvPjxyZWN0IGNsYXNzPSJjbHMtMSIgeD0iOTcuMjEiIHk9IjIyOC4yNCIgd2lkdGg9IjQiIGhlaWdodD0iMjMiLz48cmVjdCBjbGFzcz0iY2xzLTEiIHg9IjEwMi4yMSIgeT0iMjI4LjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSIyMyIvPjxyZWN0IGNsYXNzPSJjbHMtMSIgeD0iMTA3LjIxIiB5PSIyMjguMjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjIzIi8+PHJlY3QgY2xhc3M9ImNscy0xIiB4PSI4Ni4yMSIgeT0iMjI4LjI0IiB3aWR0aD0iNSIgaGVpZ2h0PSIyMyIvPjxyZWN0IGNsYXNzPSJjbHMtMSIgeD0iMTQyLjIxIiB5PSIyMjguMjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjIzIi8+PHJlY3QgY2xhc3M9ImNscy0xIiB4PSIxNDcuMjEiIHk9IjIyOC4yNCIgd2lkdGg9IjQiIGhlaWdodD0iMjMiLz48cmVjdCBjbGFzcz0iY2xzLTEiIHg9IjE1Mi4yMSIgeT0iMjI4LjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSIyMyIvPjxyZWN0IGNsYXNzPSJjbHMtMSIgeD0iMTU3LjIxIiB5PSIyMjguMjQiIHdpZHRoPSI1IiBoZWlnaHQ9IjIzIi8+PHJlY3QgY2xhc3M9ImNscy0xIiB4PSIxMzcuMjEiIHk9IjIyOC4yNCIgd2lkdGg9IjQiIGhlaWdodD0iMjMiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yNC4yMywyMTAuNDZjLTYuOCwwLTEyLjMyLDUuOTEtMTIuMzIsMTIuNzIsMCwxLjY1LjMzLDIuMDYuOTIsNS4wNkgxMi4ydjIzaDQuMzRsMy0zaDkuODVsMywzSDM2LjJ2LTIzaC0uNTZjLjU5LTMsLjkyLTMuNTQuOTItNS4xOUExMi41NSwxMi41NSwwLDAsMCwyNC4yMywyMTAuNDZabTAsMjEuNjVhOS41OCw5LjU4LDAsMSwxLDkuNTgtOS41OEE5LjU4LDkuNTgsMCwwLDEsMjQuMjMsMjMyLjExWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTczLjI1LDIxMC40NmMtNi44LDAtMTIuMzIsNS45MS0xMi4zMiwxMi43MiwwLDEuNjUuMzMsMi4wNi45Miw1LjA2aC0uNjN2MjNoNC4zNGwzLTNoOS44NWwzLDNoMy44N3YtMjNoLS41NmMuNTktMywuOTItMy41NC45Mi01LjE5QTEyLjU1LDEyLjU1LDAsMCwwLDczLjI1LDIxMC40NlptMCwyMS42NWE5LjU4LDkuNTgsMCwxLDEsOS41OC05LjU4QTkuNTgsOS41OCwwLDAsMSw3My4yNSwyMzIuMTFaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTc1LjI1LDIxMC40NWMtNi44MSwwLTEyLjMzLDUuOTEtMTIuMzMsMTIuNzIsMCwxLjY1LjMzLDIuMDYuOTIsNS4wNmgtLjYzdjIzaDQuMzRsMy0zaDkuODVsMywzaDMuODd2LTIzaC0uNTZjLjU5LTMsLjkyLTMuNTQuOTItNS4xOUExMi41NSwxMi41NSwwLDAsMCwxNzUuMjUsMjEwLjQ1Wm0wLDIxLjY1YTkuNTgsOS41OCwwLDEsMSw5LjU3LTkuNThBOS41OCw5LjU4LDAsMCwxLDE3NS4yNSwyMzIuMVoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yMjQuMjEsMjEwLjQ1Yy02LjgxLDAtMTIuMzMsNS45MS0xMi4zMywxMi43MiwwLDEuNjUuMzMsMi4wNi45Miw1LjA2aC0uNjN2MjNoNC4zNGwzLTNoOS44NWwzLDNoMy44N3YtMjNoLS41NmMuNTktMywuOTItMy41NC45Mi01LjE5QTEyLjU1LDEyLjU1LDAsMCwwLDIyNC4yMSwyMTAuNDVabTAsMjEuNjVhOS41OCw5LjU4LDAsMSwxLDkuNTgtOS41OEE5LjU4LDkuNTgsMCwwLDEsMjI0LjIxLDIzMi4xWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTEyNC4yNSwyMTAuNDZjLTYuOCwwLTEyLjMyLDUuOTEtMTIuMzIsMTIuNzIsMCwxLjY1LjMzLDIuMDYuOTIsNS4wNmgtLjYzdjIzaDQuMzRsMy0zaDkuODVsMywzaDMuODd2LTIzaC0uNTZjLjU5LTMsLjkyLTMuNTQuOTItNS4xOUExMi41NSwxMi41NSwwLDAsMCwxMjQuMjUsMjEwLjQ2Wm0wLDIxLjY1YTkuNTgsOS41OCwwLDEsMSw5LjU4LTkuNThBOS41Nyw5LjU3LDAsMCwxLDEyNC4yNSwyMzIuMTFaIi8+PHBvbHlnb24gY2xhc3M9ImNscy0xIiBwb2ludHM9Ijg0LjIxIDU1LjI0IDg0LjIxIDYwLjk2IDg4LjkzIDU1LjI1IDg0LjIxIDU1LjI0Ii8+PHBvbHlnb24gY2xhc3M9ImNscy0xIiBwb2ludHM9Ijc2LjE2IDU1LjI2IDU2Ljg5IDU1LjI4IDU3LjUgNzUuNjYgNzYuMTYgNTUuMjYiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00OS4wNSw1NS4zMUgxNEExNCwxNCwwLDAsMCwwLDY5LjQ2bC41LDM4LjMyWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTIzMi44NCw1NS4yNGgtOTFWNTEuOGMwLS4wNywwLS4xMywwLS4ydi0xN2E1LDUsMCwwLDAtNS01aC02LjY2VjIzLjc2YTEsMSwwLDAsMC0xLTFoLTEuMjJjLTEuNDItMTIsLjcyLTEzLjg1LDEtMTRDMTMxLjQ2LDcsMTQzLDEzLjM3LDE1MS40MSwxOGMxNy4zNCw5LjYxLDQwLDIyLjE5LDY1LjA2LDIyLjE5YTcxLjE4LDcxLjE4LDAsMCwwLDE1LjM5LTEuNjZMMjMwLDMwLjI3Yy0yOCw2LjE0LTU0Ljg3LTguNzgtNzQuNTEtMTkuNjdDMTQxLjI5LDIuNywxMzEtMywxMjQuMSwxLjcxYy00LjU0LDMuMS02LDkuNDctNC43NCwyMS4wNUgxMTcuNWExLDEsMCwwLDAtMSwxdjUuODVoLTYuNjZhNSw1LDAsMCwwLTUsNVY1NS4yNEg5NS43OEw5NCw1Ny4xNyw4My4zLDY4Ljg3bC00LjkzLDUuMzh2LTE0TDU2LjU3LDgzLjU5bC00Ljc0LDUuMDgtLjE2LTctLjUtMjEuM0wyLjU3LDExMi43MS4yMSwxMTUuMjVsMCwxMDcuMTZINi4zYTE4LjU5LDE4LjU5LDAsMCwxLDEyLjc2LTE2Ljc5LDE0LjQsMTQuNCwwLDAsMSw1LjIzLTEsMTQuNTUsMTQuNTUsMCwwLDEsNS4xLjkzLDE4LjMyLDE4LjMyLDAsMCwxLDEyLjg4LDE2Ljg1aDEzYTE4Ljc1LDE4Ljc1LDAsMCwxLDEyLjEyLTE2LjU3LDE0Ljc1LDE0Ljc1LDAsMCwxLDUuODYtMS4yMSwxNC4zNCwxNC4zNCwwLDAsMSw0Ljk0Ljg4LDE4LjI2LDE4LjI2LDAsMCwxLDEzLDE2LjloMTVhMTguNzUsMTguNzUsMCwwLDEsMTIuMTItMTYuNTcsMTQuNzgsMTQuNzgsMCwwLDEsNS44Ni0xLjIxLDE0LjMxLDE0LjMxLDAsMCwxLDQuODYuODYsMTguMjUsMTguMjUsMCwwLDEsMTMuMTMsMTYuOTJoMTVBMTguNTksMTguNTksMCwwLDEsMTcwLDIwNS42NGExNC42OSwxNC42OSwwLDAsMSw1LjMyLTEsMTQuMiwxNC4yLDAsMCwxLDQuNzcuODIsMTguMjUsMTguMjUsMCwwLDEsMTMuMjIsMTdoMTNhMTguNTIsMTguNTIsMCwwLDEsMTIuODctMTYuODMsMTQuNCwxNC40LDAsMCwxLDEwLjEtLjA3LDE4LjMsMTguMywwLDAsMSwxMywxNi45aDZWNzAuODVDMjQ4LjIxLDYyLjYyLDI0MS4wOSw1NS4yNCwyMzIuODQsNTUuMjRabS02Mi42NSw2MS42NGgtNC43MmMwLC41Ny0uMDYsMS0uMDYsMS40NHY4LjExYTE1LjczLDE1LjczLDAsMCwxLTkuMjMsMTQuNzcsNzQuODMsNzQuODMsMCwwLDEtMTUsNSwxMDQuOCwxMDQuOCwwLDAsMC0xMC4wOSwzLjM5LDYuMzMsNi4zMywwLDAsMC00LjM4LDYuNTVjLjEyLDQuNzUsMCw5LjUxLDAsMTQuMjUsMCwuODEuNTIuOTIsMSwxLjE1YTE0LjQ4LDE0LjQ4LDAsMSwxLTExLjY0LDAsMS4zNSwxLjM1LDAsMCwwLC45NC0xLjQ0LDcuMTksNy4xOSwwLDAsMC01LjU3LTcuMDljLTMtMS4xOS02LjE5LTIuMDktOS4zMS0zLjA3YTM5LjgsMzkuOCwwLDAsMS0xMi40Mi01LjQyLDE1LjE1LDE1LjE1LDAsMCwxLTYuNDgtMTIuMTRjLS4xMS0zLjUzLS4xLTcuMDUtLjA2LTEwLjU4YTIuNjgsMi42OCwwLDAsMC0xLjE1LTIuNDVBOSw5LDAsMCwxLDc4LjU2LDEyMGE5LjIxLDkuMjEsMCwwLDEsNi44OC03LjQxLDkuNTUsOS41NSwwLDAsMSwxMSw0LjcxQTkuNDUsOS40NSwwLDAsMSw5NC4zMiwxMjlhMy42MywzLjYzLDAsMCwwLTEuNTgsMy4zN2MuMTMsMi41NywwLDUuMTYsMCw3Ljc0YTcuNCw3LjQsMCwwLDAsNS41OCw4LjMyYzIuMzksMSw0Ljg3LDEuNjksNy4zMSwyLjUsMy43MiwxLjIzLDcuNDQsMi40NCwxMS4yOSwzLjd2LTU3SDEwNy40bDE0LjQ1LTI0LjExLDE0LjQxLDI0aC05LjQ3djQzLjM1YTI5LjI5LDI5LjI5LDAsMCwxLDMtMS4yNWM0LjktMS40NCw5Ljg0LTIuNzYsMTQuNzMtNC4yNWE2My44Niw2My44NiwwLDAsMCw3LjIyLTIuNjksNi40Nyw2LjQ3LDAsMCwwLDQuMTMtNi42MmMtLjA4LTMsMC02LDAtOS4wOUgxNTFWOTcuNzNoMTkuMTZaIi8+PC9nPjwvZz48L3N2Zz4=';

const MICROBIT = {
    usbProductId: 0x0204,
    usbVendorId: 0x0d28
};

/**
 * @class Serial
 */
class Serial {
    /**
     * Creates an instance of Serial.
     * @private
     */
    constructor(baudRate, boardsFilter = null) {
        this.baudRate = baudRate;
        this.boardsFilter = boardsFilter;
        this.port = null;
        this.reader = null;
        this.writer = null;
        this.dataReceived = null;
        this.isConnected = false;
        this.isClosing = false;
        this.isLoopClosed = true;
        this.hasFirmware = true;
        this._dtr = true;
        this._rts = true;
        return this;
    };

    /**
     * Open serial port by serial API (navigator.serial).
     * @public
     * @return {void}
     */
    async open() {
        if (this.boardsFilter !== null) {
            this.port = await navigator.serial.requestPort({
                filters: this.boardsFilter
            });
        } else {
            this.port = await navigator.serial.requestPort();
        }
        await this.port.open({
            baudRate: this.baudRate
        });
        this.isConnected = true;
        this.dataReceived = this._loop_reader();
    };
    /**
     * Close serial port from navigator.
     * @public
     * @return {void}
     */
    async close() {
        return await this.port.close();
    };
    /**
     * Reset serial.
     * @public
     */
    reset() {
        this.reader = null;
        this.writer = null;
        this.dataReceived = null;
        this.port = null;
        this.isConnected = false;
        this.isClosing = false;
    };
    /**
     * Get informations about board.
     * @public
     * @return {object} {usbVendorId, usbProductId}
     */
    async getInfo() {
        return await this.port.getInfo();
    };
    /**
     * Get serial input signals.
     * @public
     * @return {object} {dataCarrierDetect, clearToSend, ringIndicator, dataSetReady}
     */
    async getSignals() {
        return await this.port.getSignals();
    };
    /**
     * Write buffer to serial port.
     * @public
     * @param {Uint8Array} buffer
     * @return {void}
     */
    async write(buffer) {
        this.writer = this.port.writable.getWriter();
        await this.writer.write(buffer);
        this.writer.releaseLock();
    };
    /**
     * Create generator for reading packet from serial port.
     * @private
     * @yield {Uint8Array}
     * @return {void}
     */
    async *_loop_reader() {
        this.isLoopClosed = false;
        let dataClosing = "";
        const decoder = new TextDecoder('utf-8');
        try {
            this.reader = this.port.readable.getReader();
            while (true) {
                const {
                    value,
                    done
                } = await this.reader.read();
                if (done || !value) {
                    this.reader.releaseLock();
                    break;
                }
                if (value) {
                    if (this.isClosing) {
                        dataClosing += decoder.decode(value);
                        if (/exec\(open\(\'main\.py\'\)\.read\(\),globals\(\)\)/.test(dataClosing) || !this.hasFirmware) {
                            this.reader.releaseLock();
                            break;
                        }
                    } else {
                        yield value;
                    }
                }
                await this.sleep(40);
            }
        } catch (error) {
            error = String(error);
            console.log(error);
            if (error.match(/(DOMException|ParityError|BufferOverrunError): A ((framing|parity) error|buffer overrun) has been detected\./)) {
                this.dataReceived = null;
                this.dataReceived = this._loop_reader();
            } else if (error.match(/(DOMException|BreakError): A break condition has been detected\./)) {
                console.log('Please refresh page.')
            } else if (error.match(/(DOMException|NetworkError): The device has been lost\./)) {
                this.reset();
            }
        } finally {
            this.isLoopClosed = true;
        }
    };
    /**
     * Get next read packet from serial port.
     * @public
     * @return {Uint8Array}
     * @memberof Serial
     */
    async read() {
        return await this.dataReceived.next();
    };
    /**
     * Waiting function in milliseconds.
     * @public
     * @param {int}
     * @return {Promise}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
};

/**
 * @class MicropythonRepl
 */
class MicropythonRepl {
    /**
     * Creates an instance of Micropythonthis.
     * @private
     */
    constructor(peripheral, serial) {
        this.OPEN_REPL = '\x03';
        this.END_MPY_CMD = '\r\n';
        this.serial = serial;
        this.peripheral = peripheral;
        this.buffer = "";
        this.hasFirmware = true;
        this.Queue = new Queue();
        return this;
    };
    /**
     * Open REPL by sending [0x03] to serial port.
     * @public
     * @return
     */
    async open() {
        return await this.serial.write(new TextEncoder('utf-8').encode(this.OPEN_REPL));
    };
    /**
     * Send micropython command to serial port.
     * @public
     * @param {string} cmd
     * @return
     */
    async sendCommand(cmd) {
        return await this.serial.write(new TextEncoder('utf-8').encode(cmd + this.END_MPY_CMD));
    };
    /**
     * Add Micropython command in Queue.
     * @public
     * @param {string} cmd
     */
    enqueueCommand(cmd) {
        this.Queue.enqueue(cmd);
    };
    /**
     * Send list of Micropython command to this.
     * @public
     * @param {Array<string>} commands
     * @returns {void}
     */
    enqueueCommandList(commands) {
        for (let i = 0; i < commands.length; i++) {
            this.enqueueCommand(commands[i]);
        }
    };
    /**
     * Check if line found at the end of serial buffer.
     * @public
     * @param {string} buffer
     * @param {string} line
     * @param {int} index
     * @returns {boolean}
     * @memberof MicropythonRepl
     */
    isEndOf(buffer, char, index) {
        const strSplitted = buffer.split('\n');
        if (strSplitted[0][strSplitted[0].length - index] === char) {
            return true;
        } else {
            return false;
        }
    };
    /**
     * Parse buffer received by serial to get some informations.
     * @public
     * @param {string} buffer
     * @returns {object}
     * @memberof MicropythonRepl
     */
    parseResponse(buffer, isJsonResponse) {
        let jsonRep = "";
        let textToPrint = "";
        if (buffer) {
            if (isJsonResponse) {
                if (buffer.indexOf("}") > -1) {
                    isJsonResponse = false;
                    const repSplitted = buffer.split("}");
                    jsonRep += repSplitted[0];
                    if (repSplitted[1]) {
                        textToPrint += repSplitted[1];
                    }
                } else {
                    jsonRep += buffer;
                }
            } else {
                if (buffer.indexOf("{") > -1) {
                    isJsonResponse = true;
                    const bufferSplitted = buffer.split("{");
                    if (bufferSplitted[0]) {
                        textToPrint += bufferSplitted[0];
                    }
                    if (bufferSplitted[1]) {
                        if (bufferSplitted[1].indexOf("}") > -1) {
                            isJsonResponse = false;
                            const repSplitted = bufferSplitted[1].split("}");
                            jsonRep += repSplitted[0];
                            if (repSplitted[1]) {
                                textToPrint += repSplitted[1];
                            }
                        } else {
                            jsonRep += bufferSplitted[1];
                        }
                    }
                } else {
                    textToPrint += buffer;
                }

            }
        }
        return {
            textToPrint,
            jsonRep,
            isJsonResponse
        };
    };
    /**
     * Check if line found at the end of serial buffer.
     * @private
     * @param {string} buffer
     * @param {string} line
     * @param {int} index
     * @returns {boolean}
     * @memberof MicropythonRepl
     */
    _isEndOf(buffer, line, index) {
        const strSplitted = buffer.split('\n');
        if (strSplitted[strSplitted.length - index] === line) {
            return true;
        } else {
            return false;
        }
    };
    /**
     * Parse buffer received by serial to get some informations.
     * @private
     * @param {string} buffer
     * @returns {object}
     * @memberof MicropythonRepl
     */
    _parseResponse(buffer) {
        let linesToPrint = new Array();
        let isError = false;
        while (true) {
            if (/\n/.test(buffer)) {
                const strSplitted = buffer.split('\n');
                buffer = "";
                // Check first item
                if (strSplitted[0] != "") {
                    buffer += strSplitted[0];
                }
                const data = {
                    'str': strSplitted[0],
                    'buffer': strSplitted.join('\n'),
                    'push': buffer,
                    'resetBuf': true
                };
                const dataParsed = this._parseCase(data, buffer, isError);
                buffer = dataParsed.buffer;
                isError = dataParsed.isError;
                if (dataParsed.line !== null) {
                    linesToPrint.push(dataParsed.line);
                }
                if (isError) {
                    break;
                }
                // Loop
                const lastIndex = strSplitted.length - 1;
                for (var s = 1; s < lastIndex; s++) {
                    const data = {
                        'str': strSplitted[s],
                        'buffer': strSplitted.slice(s).join('\n'),
                        'push': strSplitted[s]
                    };
                    const dataParsed = this._parseCase(data, buffer, isError);
                    buffer = dataParsed.buffer;
                    isError = dataParsed.isError;
                    if (dataParsed.line !== null) {
                        linesToPrint.push(dataParsed.line);
                    }
                    if (isError) {
                        break;
                    }
                }
                if (isError) {
                    break;
                }
                // Check last item
                if (strSplitted[lastIndex] == "") {
                    if (buffer != "") {
                        const data = {
                            'str': "",
                            'buffer': "",
                            'push': buffer
                        }
                        const dataParsed = this._parseCase(data, buffer, isError);
                        buffer = dataParsed.buffer;
                        isError = dataParsed.isError;
                        if (dataParsed.line !== null) {
                            linesToPrint.push(dataParsed.line);
                        }
                        if (isError) {
                            break;
                        }
                    }
                    buffer = "";
                } else if (lastIndex) {
                    buffer += strSplitted[lastIndex];
                }
            }
            break;
        }
        let textToPrint = "";
        for (var i = 0; i < linesToPrint.length; i++) {
            if (linesToPrint[i].indexOf("{\"cmd\":") > -1) {
                const cleanedLine = this.convert(linesToPrint[i]);
                this.peripheral.response = JSON.parse(cleanedLine);
                this.peripheral.waitingResponse = false;
                console.log(this.peripheral.response)
            } else {
                textToPrint += linesToPrint[i] + "\n";
            }
        }
        return {
            textToPrint,
            buffer,
            isError
        };
    };
    /**
     * Parse switching case.
     * @param {Object} data
     * @param {string} buffer
     * @param {boolean} isError
     * @returns
     */
    _parseCase(data, buffer, isError) {
        let line = null;
        if (/Traceback/.test(data.str)) {
            isError = true;
            buffer = data.buffer;
        } else if (/rst\:0x3 \(SW\_RESET\)/.test(data.str) || /rst\:0x10 \(RTCWDT\_RTC\_RESET\)/.test(data.str) || /esp\_image\: checksum failed\./.test(data.str)) {
            this.hasFirmware = false;
        } else {
            line = data.push;
            if (data.resetBuf) {
                buffer = "";
            }
        }
        return { 'isError': isError, 'buffer': buffer, 'line': line };
    };
    /**
     * Set REPL state and update its button style.
     * @public
     * @param {boolean} state
     * @returns {void}
     */
    setRepl(state) {
        if (this.isOpen != state) {
            this.isOpen = state;
        }
    };
    /**
     * Reading loop for printing data read by serial 'dataReceived' yield on console.
     * @public
     * @param {boolean} state
     * @returns {void}
     */
    async readingLoop() {
        const utf8Decoder = new TextDecoder('utf-8');
        while (true) {
            if (!this.serial.isConnected) {
                break;
            }
            const { value, done } = await this.serial.read();
            if (done || !value) {
                if (this.serial.isClosing) {
                    break;
                }
                continue;
            } else {
                this.buffer += utf8Decoder.decode(value);
                if (this._isEndOf(this.buffer, '>>> ', 1)) {
                    this._parseResponse(this.buffer);
                    this.setRepl(true);
                    this.buffer = "";
                    if (!this.Queue.isEmpty()) {
                        await this.sendCommand(this.Queue.dequeue());
                    } else {
                        this.Queue.reset();
                    }
                } else {
                    this.setRepl(false);
                }
                const parsedRep = this._parseResponse(this.buffer);
                this.buffer = parsedRep.buffer;
                if (parsedRep.textToPrint) {
                    // TO DO : where go user data from serial (errors or print())
                    console.log(parsedRep.textToPrint);
                }
            }
        }
    };

    convert (line) {
        line = line.replace(/True/gi, "true");
        line = line.replace(/False/gi, "false");
        line = line.replace(/None/gi, "null");
        return line;
    };

}

class Queue {
    constructor() {
        this.data = [];
        this.rear = 0;
    }
    enqueue(element) {
        this.data[this.rear] = element;
        this.rear = this.rear + 1;
    };
    length() {
        return this.rear;
    }
    isEmpty() {
        return this.rear === 0;
    }
    dequeue() {
        if (this.isEmpty() === false) {
            this.rear = this.rear - 1;
            return this.data.shift();
        }
    };
    reset() {
        this.data = [];
        this.rear = 0;
    };
}

/**
 * Manage communication with a MicroBit peripheral over a Scrath Link client socket.
 */
class MicroBit {

    /**
     * Construct a MicroBit communication object.
     * @param {Runtime} runtime - the Scratch 3.0 runtime
     * @param {string} extensionId - the id of the extension
     */
    constructor(runtime, extensionId) {

        /**
         * The Scratch 3.0 runtime used to trigger the green flag button.
         * @type {Runtime}
         * @private
         */
        this._runtime = runtime;

        this._runtime.registerPeripheralExtension(extensionId, this);

        this.waitingResponse = false;
        this.response = false;

        // Create a new Serial instance
        this._serial = new Serial(115200, [MICROBIT]);

        // Create a new MicropythonRepl instance
        this._repl = new MicropythonRepl(this, this._serial);

        this.reset = this.reset.bind(this);
        this.ready = false;

        /**
         * The most recently received value for each sensor.
         * @type {Object.<string, number>}
         * @private
         */
        this._screenMatrix = new Uint8Array(5);
    }

    /**
     * Called by the runtime when user wants to scan for a peripheral.
     */
    async connect() {
        try {
            await this._serial.open();
            console.log(await this._serial.getInfo());
            console.log(await this._serial.getSignals());
            console.log(this._serial.port);
            this.ready = true;
            this._repl.readingLoop();
        } catch (e) {
            let err = String(e);
            console.log(err)
            if (err.match(/(DOMException|NotFoundError): No port selected by the user/)) {
                this._serial.reset();
            }
            if (err.match(/NetworkError: Failed to open serial port/)) {
                this._serial.reset();
            }
        }
    }

    downloadFile() {
        const fileName = 'vitta_microbit_cmd_1_1.hex';
        const a = window.document.createElement('a');
        // TODO Warning this static file must be present at this very specific
        // path of the target website. For now, the .hex file is manualy added
        // in the "static" dir of "scratch-gui" which introduces a strong
        // coupling between the path below and the "scratch-gui" package
        // organization. But this is better than a very big hex string in this
        // JavaScript file.
        a.href = `extensions/vittamicrobit/${fileName}`;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        return Promise.resolve(0);
    }

    /**
     * Reset all the state and timeout/interval ids.
     */
    reset() {
        return this._serial.reset();
    }

    /**
     * Return true if connected to the micro:bit.
     * @return {boolean} - whether the micro:bit is connected.
     */
    isConnected() {
        return this._serial.isConnected;
    }

    /**
     * Send a message to the peripheral.
     * @param {Uint8Array} command - the message to write
     */
    async send(command) {
        if (!this.isConnected()) return;
        if (!this._repl.isOpen) {
            this.toggleReplOverture();
        }
        await this.waitRepl();
        this._repl.sendCommand(command);
    }

    /**
     * Get a response value from the peripheral by enqueuing commands.
     * @param {Array<string>} commands
     */
    async get(commands) {
        if (!this.isConnected()) return;
        this._repl.enqueueCommandList(commands);
        this.waitingResponse = true;
        if (!this._repl.isOpen) {
            this.toggleReplOverture();
        } else {
            this._repl.sendCommand(this._repl.Queue.dequeue());
        }
    }

    waitFor(conditionFunction) {
        const poll = resolve => {
            if (conditionFunction()) {
                resolve();
            } else {
                setTimeout(_ => poll(resolve), 0);
            }
        }
        return new Promise(poll);
    };

    async waitRepl() {
        var that = this;
        await this.waitFor(_ => that._repl.isOpen === true);
    }

    async waitBoardResponse() {
        var that = this;
        await this.waitFor(_ => that.waitingResponse === false);
        return this.response;
    }

    async toggleReplOverture() {
        var that = this;
        const openRepl = async function () {
            if (that._repl && that._serial.hasFirmware) {
                if (!that._repl.isOpen) {
                    await that._repl.open();
                }
            }
        };
        if (this._serial.isConnected) {
            await openRepl();
        } else {
            await this._serial.connect();
            if (this._serial.isConnected) {
                await openRepl();
            }
        }
    };
}

class Scratch3VittaMicrobitBlocks {
    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME() {
        return 'micro:bit';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID() {
        return 'vittamicrobit';
    }

    /**
     * Construct a set of MicroBit blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor(runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Create a new MicroBit peripheral instance
        this._peripheral = new MicroBit(this.runtime, Scratch3VittaMicrobitBlocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        this._locale = this.setLocale();
        return {
            id: 'vittamicrobit',
            name: 'micro:bit',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // FIXME:
            blocks: [
                {
                    opcode: 'display_show',
                    text: this.getMessage('display_show'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'display_scroll',
                    text: this.getMessage('display_scroll'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Bonjour !'
                        }
                    }
                },
                {
                    opcode: 'show_icon',
                    text: this.getMessage('show_icon'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ICON: {
                            type: ArgumentType.STRING,
                            menu: 'icons'
                        }
                    }
                },
                {
                    opcode: 'show_leds',
                    text: this.getMessage('show_leds'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MATRIX: {
                            type: ArgumentType.MATRIX,
                            defaultValue: '1000110000010100101000100'
                        }
                    }
                },
                {
                    opcode: 'display_clear',
                    text: this.getMessage('display_clear'),
                    blockType: BlockType.COMMAND,
                },
                '---',
                {
                    opcode: 'display_lcdSetText',
                    text: this.getMessage('display_lcdSetText'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Bonjour Vittabot'
                        },
                        LINE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        POS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                    }
                },
                {
                    opcode: 'display_lcdClear',
                    text: this.getMessage('display_lcdClear'),
                    blockType: BlockType.COMMAND,
                },
                '---',
                {
                    opcode: 'io_isButtonPressed',
                    text: this.getMessage('io_isButtonPressed'),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'buttons'
                        },
                        TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'buttons_type'
                        }
                    }
                },
                {
                    opcode: 'io_isPinPressed',
                    text: this.getMessage('io_isPinPressed'),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'touchPins'
                        }
                    }
                },
                '---',
                {
                    opcode: 'sensors_getTemperature',
                    text: this.getMessage('sensors_getTemperature'),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        UNIT: {
                            type: ArgumentType.STRING,
                            menu: 'temperature_unit'
                        }
                    }
                },
                {
                    opcode: 'sensors_getLight',
                    text: this.getMessage('sensors_getLight'),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'sensors_getAcceleration',
                    text: this.getMessage('sensors_getAcceleration'),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        AXIS: {
                            type: ArgumentType.STRING,
                            menu: 'acceleration_axis'
                        }
                    }
                },
                {
                    opcode: 'sensors_getCompass',
                    text: this.getMessage('sensors_getCompass'),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'sensors_calibrateCompass',
                    text: this.getMessage('sensors_calibrateCompass'),
                    blockType: BlockType.COMMAND,
                },
                '---',
                {
                    opcode: 'actuators_setServoAngle',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('actuators_setServoAngle'),
                    arguments: {
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        },
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'digital_pins'
                        }
                    }
                },
                '---',
                {
                    opcode: 'radio_dataReceived_string',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('radio_dataReceived_string')
                },
                {
                    opcode: 'radio_dataReceived_number',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('radio_dataReceived_number')
                },
                {
                    opcode: 'radio_dataReceived_bool',
                    blockType: BlockType.BOOLEAN,
                    text: this.getMessage('radio_dataReceived_bool')
                },
                {
                    opcode: 'radio_sendData_string',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('radio_sendData_string'),
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Je suis le message radio !'
                        }
                    }
                },
                {
                    opcode: 'radio_sendData_number',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('radio_sendData_number'),
                    arguments: {
                        DATA: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 3.14
                        }
                    }
                },
                {
                    opcode: 'radio_sendData_bool',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('radio_sendData_bool'),
                    arguments: {
                        DATA: {
                            type: ArgumentType.BOOLEAN,
                            defaultValue: true
                        }
                    }
                },
                '---',
                {
                    opcode: 'uart_sendDataAndGetResultAsString',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('uart_sendDataAndGetResultAsString'),
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: 'temperature()'
                        }
                    }
                },
                {
                    opcode: 'uart_sendDataAndGetResultAsBoolean',
                    blockType: BlockType.BOOLEAN,
                    text: this.getMessage('uart_sendDataAndGetResultAsBoolean'),
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: 'button_a.is_pressed()'
                        }
                    }
                },
                // TODO Does this block work as aexpected? Keep it? remove it?
                {
                    opcode: 'uart_onDataReceived',
                    blockType: BlockType.CONDITIONAL,
                    branchCount: 1,
                    text: this.getMessage('uart_onDataReceived'),
                    hideFromPalette: true
                },
            ],
            menus: {
                icons: {
                    acceptReporters: false,
                    items: [{
                        text: "HEART",
                        value: "HEART"
                    }, {
                        text: "HAPPY",
                        value: "HAPPY"
                    }, {
                        text: "SAD",
                        value: "SAD"
                    }, {
                        text: "YES",
                        value: "YES"
                    }, {
                        text: "NO",
                        value: "NO"
                    }, {
                        text: "STICKFIGURE",
                        value: "STICKFIGURE"
                    }, {
                        text: "PITCHFORK",
                        value: "PITCHFORK"
                    }, {
                        text: "UMBRELLA",
                        value: "UMBRELLA"
                    }, {
                        text: "SKULL",
                        value: "SKULL"
                    }, {
                        text: "CHESSBOARD",
                        value: "CHESSBOARD"
                    }, {
                        text: "BUTTERFLY",
                        value: "BUTTERFLY"
                    }]
                },
                buttons: {
                    acceptReporters: false,
                    items: [{
                        text: 'A',
                        value: 'A'
                    }, {
                        text: 'B',
                        value: 'B'
                    }]
                },
                touchPins: {
                    acceptReporters: false,
                    items: [{
                        text: 'LOGO',
                        value: 'pin_logo'
                    }, {
                        text: 'P0',
                        value: 'pin0'
                    }, {
                        text: 'P1',
                        value: 'pin1'
                    }, {
                        text: 'P2',
                        value: 'pin2'
                    }]
                },
                buttons_type: {
                    acceptReporters: false,
                    items: [{
                        text: this.getMessage('io_buttonPressed-is'),
                        value: 'is'
                    }, {
                        text: this.getMessage('io_buttonPressed-was'),
                        value: 'was'
                    }]
                },
                temperature_unit: {
                    acceptReporters: false,
                    items: [{
                        text: '(°C)',
                        value: 'CELSIUS'
                    }, {
                        text: '(K)',
                        value: 'KELVIN'
                    }, {
                        text: '(°F)',
                        value: 'FAHRENHEIT'
                    }]
                },
                acceleration_axis: {
                    acceptReporters: false,
                    items: [{
                        text: 'x',
                        value: 'x'
                    }, {
                        text: 'y',
                        value: 'y'
                    }, {
                        text: 'z',
                        value: 'z'
                    }]
                },
                digital_pins: {
                    acceptReporters: false,
                    items: [{
                        text: 'P0',
                        value: 'pin0'
                    }, {
                        text: 'P1',
                        value: 'pin1'
                    }, {
                        text: 'P2',
                        value: 'pin2'
                    }, {
                        text: 'P3',
                        value: 'pin3'
                    }, {
                        text: 'P4',
                        value: 'pin4'
                    }, {
                        text: 'P5',
                        value: 'pin5'
                    }, {
                        text: 'P6',
                        value: 'pin6'
                    }, {
                        text: 'P7',
                        value: 'pin7'
                    }, {
                        text: 'P8',
                        value: 'pin8'
                    }, {
                        text: 'P9',
                        value: 'pin9'
                    }, {
                        text: 'P10',
                        value: 'pin10'
                    }, {
                        text: 'P11',
                        value: 'pin11'
                    }, {
                        text: 'P12',
                        value: 'pin12'
                    }, {
                        text: 'P13',
                        value: 'pin13'
                    }, {
                        text: 'P14',
                        value: 'pin14'
                    }, {
                        text: 'P15',
                        value: 'pin15'
                    }, {
                        text: 'P16',
                        value: 'pin16'
                    }]
                }
            }
        };
    }

    // *** Common blocks utils functions *** //

    async getResponse(command, string=false) {
        await this._peripheral.waitBoardResponse();
        let value = `value = ${command}`;
        if (string) value = `value = '"' + ${command} + '"'`;
        const commands = [
            value,
            `response = respond("${command}", status = 1, value=value)`,
            'print(response)'
        ]
        this._peripheral.get(commands);
        return await this._peripheral.waitBoardResponse();
    }

    async getRadioResponse(command) {
        await this._peripheral.waitBoardResponse();
        const commands = [
            `value = ${command}`,
            `value = '"' + str(value) + '"' if value is not None else None`,
            `response = respond("${command}", status = 1, value=value)`,
            'print(response)'
        ]
        this._peripheral.get(commands);
        return await this._peripheral.waitBoardResponse();
    }

    // *** Blocks extension functions *** //

    async display_show(args) {
        let value = args.VALUE;
        if (typeof args.VALUE == 'boolean') {
            value = value ? 'True' : 'False';
        }
        await this._peripheral.send(`display.show(${value})`);
    }

    async display_scroll(args) {
        let value = args.VALUE;
        if (typeof value === 'boolean') {
            value = value ? 'True' : 'False';
        }
        await this._peripheral.send(`display.scroll("${value}")`);
    }

    async show_icon(args) {
        await this._peripheral.send(`display.show(Image.${args.ICON})`);
    }

    async show_leds(args) {
        const symbol = cast.toString(args.MATRIX).replace(/\s/g, '');
        const reducer = (accumulator, c, index) => {
            const value = (c === '0') ? accumulator : accumulator + Math.pow(2, index);
            return value;
        };
        const hex = symbol.split('').reduce(reducer, 0);
        if (hex !== null) {
            this._peripheral._screenMatrix[0] = hex & 0x1F;
            this._peripheral._screenMatrix[1] = (hex >> 5) & 0x1F;
            this._peripheral._screenMatrix[2] = (hex >> 10) & 0x1F;
            this._peripheral._screenMatrix[3] = (hex >> 15) & 0x1F;
            this._peripheral._screenMatrix[4] = (hex >> 20) & 0x1F;
            const matrixData = this.toBinString(this._peripheral._screenMatrix, 5).slice(1).replace(/1/g, '9');
            await this._peripheral.send(`display.show(Image('${matrixData}'))`);
        }
    }

    async display_clear() {
        await this._peripheral.send('display.clear()');
    }

    async display_lcdSetText(args) {
        await this._peripheral.send(`lcd.setCursor(${args.LINE}, ${args.POS})`);
        await this._peripheral.send(`lcd.writeTxt(\"${args.TEXT}\")`);
    }

    async display_lcdClear() {
        await this._peripheral.send(`lcd.clear()`);
    }

    async io_isButtonPressed(args) {
        const response = await this.getResponse(`button_${args.BTN.toLowerCase()}.${args.TYPE}_pressed()`);
        return response.value;
    }

    async io_isPinPressed(args) {
        const response = await this.getResponse(`${args.PIN}.is_touched()`);
        return response.value;
    }

    async sensors_getTemperature(args) {
        const response = await this.getResponse('temperature()');
        let t = response.value;
        switch (args.UNIT) {
            case "CELSIUS":
                return t;
            case "FAHRENHEIT":
                return t * 9 / 5 + 32
            case "KELVIN":
                return t + 273.15;
            default:
                return t;
        }
    }

    async sensors_getLight() {
        const response = await this.getResponse('display.read_light_level()');
        return response.value;
    }

    async sensors_getAcceleration(args) {
        const response = await this.getResponse(`accelerometer.get_${args.AXIS}()`);
        return response.value;
    }

    async sensors_calibrateCompass() {
        await this._peripheral.send('compass.calibrate()');
    }

    async sensors_getCompass() {
        const response = await this.getResponse('compass.heading()');
        return response.value;
    }

    async actuators_setServoAngle(args) {
        await this._peripheral.send(`setServoAngle(${args.PIN}, ${args.ANGLE})`);
    }

    async radio_dataReceived_string() {
        const response = await this.getRadioResponse('radio_receiveData()');
        return String(response.value);
    }

    async radio_dataReceived_number() {
        const response = await this.getResponse('radio_receiveData()');
        return Number(response.value);
    }

    async radio_dataReceived_bool() {
        const response = await this.getResponse('radio_receiveData()');
        return Boolean(response.value);
    }

    async radio_sendData_string(args) {
        await this._peripheral.send(`radio.send("${args.DATA}")`);
    }

    async radio_sendData_number(args) {
        await this._peripheral.send(`radio_send(${args.DATA})`);
    }

    async radio_sendData_bool(args) {
        const state = args.DATA ? '1' : '0';
        await this._peripheral.send(`radio_send(${state})`);
    }

    async uart_sendData(args) {
        await this._peripheral.send(args.DATA);
    }

    async uart_sendDataAndGetResultAsString(args) {
        return String(await this.uart_sendDataAndGetResult(args));
    }

    async uart_sendDataAndGetResultAsBoolean(args) {
        return Boolean(await this.uart_sendDataAndGetResult(args));
    }

    async uart_onDataReceived(args) {
        const {value, done} = await this._serial.read();
        const data = new TextDecoder('utf-8').decode(value);
    }

    // *** Util extension functions *** //

    setLocale() {
        const locale = formatMessage.setup().locale;
        if (localisation.availableLocales.includes(locale)) {
            return locale;
        } else {
            return 'en';
        }
    }

    getMessage(id) {
        return localisation.messages[id][this._locale];
    }

    reverseString(str) {
        if (str === "") return "";
        return this.reverseString(str.substr(1)) + str.charAt(0);
    }

    toBinString(bytes, size) {
        return bytes.reduce((str, byte) => str + ':' + this.reverseString(byte.toString(2).padStart(size, '0')), '');
    }

}

module.exports = Scratch3VittaMicrobitBlocks;
