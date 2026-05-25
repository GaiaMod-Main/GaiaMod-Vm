const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const cast = require('../../util/cast');
const formatMessage = require('format-message');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');


// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAACNmSURBVHhe7VwHeBXV1l03vfcEUgkhlCSQRu+CVKWKypOiiIIgCFhoKqKiIAKCCIqAgIgKIr0jvRMIkBBCeiUQ0kjvyf3XOXeCRFIR39P/c/GF5M7MnTuzz9l7r7XPnqtSE/gXjwwt5fe/eET8a8A/if+JC5eWlSLjXiYKCgogPl1fXw/WlpbQ09NTjvjn4L9mwMioaFy9FoygkFBExcYjNS0NhQVF3FNOw+nD0sIc9vZ2aNXSE238fOHT0usfYdC/3IDHT57G9t17ce7iZaSlZXCLCro0THFxKXR1dfmaH69WoaxcDbWWFveWwchQD94eTTF4QH8M6N8Ppqam8lx/R/xlBgwNj8Tyld/i8JGTKCkpgZurMzp3bAcf75Zo3tQdv+7cg917D8LI2BBlZWqUlpYhN78QhYVFNKI2zM1N6OqFcOX7pk4ch369nlTO/PfCX2LAfQcP48NPFyMh8Rb8abAXRw5H3149YGVtpRyhwZ07ydDW1kJ5eTmNWIZbt5MRFh6FU6fOIehGBO7lZKFUXQYDXS2MfH4Y3n1nGnR0dJR3/z3w2A24c88+zP7gM2Tn5KL3E52wYulnMHkEF3zvg08QHZuAkJsRyGOsLKWBhw/tj/kfvfe3io2Plcacu3QJc+cvEVGNN6mDl0b/55GMV1hUCF8fD2z+YTXWrPgcHu4u0FKVY+few1iybKVy1N8D2h8Syt9/Cvn5eZgxZy7dMh1mJsawtLJCRnoqQsNuIjMrm4lCDX0D/TrNnsjISOTm5KBZs2ZwdnLE0/17I4rbEm7dRlR0LJq6u6Kxq6ty9P8Wj82FN/28GYuXr4KetgE8m7shjTzvyR5doa2jjXjGwoL8fNjZ2aCRswN8W7WCp4cn+Z++8u7KOHDgIBwdHeHt3UrZAskZJ781ExcvBaFjOz+sXPZ5jYORzQEIDYtAGH/ibyXh3r17zPTlzPzasGEsFgPQ1M0N7k0aw8LcXHlX/fFYDFhcXIzxk6biWvBNPN3nSXzw/gycP38Re/YfhEpbF809WsDZpRGKaISYmEjpjg3t7ODZogXfrUJTZmUDxZjictat24Bnnx3GTGwmt1UgOTkZ4ya+iTspqVi2aB66dOqo7Pkd0bFx+GXbTpxgIkq6cxdFRUWSImlr60CLNCmfAymok5ZKC4aGBnCwt4VPKy883bcPnujWqd5J6rEY8Nq1ILw1aw5d1wRrVy2HjY2N3C4ufvfeAzjw21GERUQjLSMTKpUKlpbmaGhrS35njPCwMCaGOej1ZA/5HpGZDxw8hLEvvyRf/xF79uzHux9+ivYd2mLJ/I9oZM3sKSgswNr1P+DHzdtxNyUT2lrazO6lKCstJlVXc7bqS+PkZmfLGK3F/SodXXqIDtSlJdDX04afnyfGvjiKjKHulOmxGFBk3s+XLMP4MaMxZsyLytbKSExMREDgNbpgIK7fCEVc/C2Uq8uho62Hvk92xgjSFH//1jh56jRniza6de2svLMySkqKMfGN6Th76SqaNWmE/v36Qs9Aj3zzGAIvXYM2Z5bgkuaWZlQznvDzaQljI0MOXgbDAHmli5Pcfzc1HTcjohDOgc1Iz9CEAw6uSltN8t4L70ydDGeGkdrwWAz49eq12LvvINas/BKODPq1QcSzUM68Gzdu4tNFyzHqP8/AwswE8fGJTDiZeP65YYyfPaQhq8K2Hbvx9ux50NHVR2lJEQdBqBsDlJOMGxvq4IXhz2DokAGMb02Ud4BJKRvZ2VlwcHRWtmgQG5eAI8dOYPvOvYyXUdA1MiILKEBTDs7H789E5w7tlSOrxmPJwoePHsed5FS89uoYZUvNEBLOwd4ehvpaOLRvD/xbeWDq1Gm8eUOcPnMaZwMu0u2PIP1eOgO8BawsLZV3auDayBlBQcHM1jHCF2XcLCnKR/vWPli6eD6GDB4AK7KAB5HBJJKWlo4GDRooWzQQGry1nw9GDh/G95gh4PJlqY6SklJ4X0fh3rgRB8JNOfphPBYD3gyLxA9bfmUc0UH7tm2UrbXj8KEDiAgPhaGeFno+2QvBN8LI/7wxeuRIZDKLHznKmcHZdvFyoDxeUBpdxi0xAP2YrFyc7BlHTXiDrhgxfCjmvPsO7B3s5bF/hKBZmZmZsLd3ULZURnZWFm7fuY2wm2Fg4IQTBzjjXi6OnDjDJOMBF2cn5cjKeCwufIDSbSsznwjWLk5O+HDObJnxasOe7T/h/Jkz5IeGGPnyOKxa9wPmzJp5P/tmZ+fg4sUAnDl/AVExMaQflnjnzWk0ZNU3UxPS0tIQGxuLtm3bKls0yM3LxeYtvzDZ7Ucys7ueDtlAeRlWfb1ccs4pMz6Ao7MjflzzFdwaP8w9H8sM1FLRFcxNMfWNSVi3YRNj1B608feFhYWFckTVSIiNxM2QEJSptRBLrmhv74gunTspe0WdUB9N6D49uneTVRkfb2/YMXs/ih4WWjsx6TYaubgoW0DdHY6Zs9/Dvv2HUFKmhoqZuay4CO/Nmo4uXTqjRYtmDCv6+GX7HmRx9j7Vt5dkEQ/isUg5F16UKIoaMoZtWPs144wthgx/kcllHbLoGtVBh0mijDww9V4WOVsyBjzVX9nzMIQxxcyrjnzXBpGQcnNzlFfAsRMn8PqUqQhnHDU3t2QMLQQ5Nj784F0MGPC0chQwnnH9uYFPYdeBYzhw+Jiy9Xc8lhkoLi4vL0/yPsEB+3OkTOmG36xaw9HbxWSQBSMa14IBW/eB2XMj+DISExKRnpmLvqQjnTpVTV0eF0R1yL6hPTZs3IQV33yL/IIiyQ9zmZ1buDfBZ5/OQ+dOv3tABXxJhfYfOkpFlYiBT/Wp5AGPJQYK5OXly1g4aNDT0JOFUo1y2PjTVhpxN+6RnjR2dYZH82ZoxosV8S0zJQFWJga4dC0UPXv3wuRJU+T7/iqcO3+OHLAYk6eJOGvKWVcEE2bcUSP+g5H8MSSFqQ5r1m7EFyvXYPXXi9C1Ywdl62OagQJ6errIyEgltwtBs2bN5TYTKpPOHdtjyMD+cGUWy83Nlfr02IlTCAy8Sr2ajyIqiPDYJJhZWKN/n97yfX8VIiIjpbyMI/eztDBFz+5dMWvG2+hLGaepjlePgoJ8/HbkBBrYWqNDuweYhpiBjwvUxOrV365Sky4oWx4GSbQ6Ni5OffT4CXX7bk+qm7dso27UzF89dfp7yhEaMOirCwsLlFd/HidOnVIPHzFa7deus9qfP+cvnFf21A0BAZfV3Xo+rZ7y5nReW6myVc309xghRrFMrY0LFwKULQ/DwMCARLiR5IvGxsbQId3RLiuBrqpcOUKDPM7WPAb9bLp+HqmGiK+PguS7yZj36UJMnzELOdkpaNHcDVTBiIuOVI6oG9zd3WThIYuhR0jBCjxWA0ZGx+CnrTtw8vQZZUv1KCkpZTCmwSnkxY/kQgoE5SijUY0Yk3R0qDTIy9LTUsjlUuX6Sl2xd/9+Zto3sXX7Nvj7+ZJDvoWSwhw0tDWh/k1WjqobLKmGmjVtIis7oixWgT9twNi4eOzefwDzlyzFqxOncMTTEZ9wi3tqzk2GxkawYmb20TeCKedEAQ1agZLiYll+EmcQ3EyHP0LoFxfm88bTqCjuIZ2/RcFWaFxRThPvqfhMMVs/W7wU8xcuRnxsHPo8+QQWf75QFi5UpcUY3Lcr/Hx85bH1QRPKOn1yHRX/VeCRDJhD99q+azcNNhnPjngJk6bMxFcr1zHrpktB72jfkEdVJpwPgbtdyelKtcuRxdmWeTdT2aFZeNfjPmFElUobpaWl5H+GMDYyhgF/62hryfKTEDsqGq2Ihs3Pz+U7VbIc9vaM2VQXW2DEc4x/ZQw+X7BAJrT4hDjKRl2oOYt1hOKoJ4QwEMVYUUesQL0MWFBYiPUbf8SzL7yEt2fNxaHj53AvpwB6lGIG+gbIy8mDlZkxXn5plDw+OPg6du3eK2fIH6HLWWXHY+NKymHZuDFCKbMyMu7JfVeuBOLSpQDOsnuyzBQbH4vd+/ajkOcRhF3wMJVKS8pFLXJQEXuFu18ODMREUqGLAZcwoF9vrFi+FK+99po8RlSAoiIjaEgDKTkNTYzlZ9UHYn6L+P1glajOBgwIvIJRY17DRx8vQkxsoiwflXIkCzjyuuSVdrbmpCt9sXbNCnh4esgLXrz0S0ql93Hk6HHlLL9D3HwjN3foGZvD0rkhE0Y2ApSiQVxMHKKjo3H27Dl5XAwNeOLUaQbwXNnRcJeaNZ/nF8XQCmklriXpVjwplDtW0nCfzJtHKSYq3hpcp2S8cPES7KmSitXlOBdwWdlTN+SS5544fRrt2rZWtmhQJwOuXb8JYydMQ2BQCIzpCsUFnAl0oyED+mDl4gXYuXkjDu/ZzhFfBG/vlvI9W3fsRHhUNMyoSKqr6+mamaF9r27wbNAQJrr6OHnqHLIzMzgY1lLReLRojmJKrIBLl+DCkS/IL+BsLmLcjWWcK4QBXUnMUH3+ZGdnooG1JRbO/4Q3+XBF6O7dVNxNzUByajYuXYnA9z/txJHjp5hRC5UjqoZYnt289Vc8NehZJjs1/P39lD0a1KjKSXMwf/EyfPf9zwyeenQ7HRlrBnGmTRg/Bl6caVUhLT0dO7btkDGInAmOjlWXmIQG8m/eHL5eTXHy2Emcu3ARQcHdmDgAGysbODs2REhIkOypGTXqZRqvEDaWjshiDG5gZ43zlwIRQHft3KY9rK3MqHaykZefL+PdH3HvXgZyCkpx/MJN6NBlcnncyDHj4MlBatvGn+rIDeaUmnq8z1ImNFG9uRoUhKDQGzA1MkFzd1dMf2uqcrbfUaMBP//iK3y34WdekCnyyH9srUzx3uy5GDjgKeWIqnHg0GEmlLvkfEZk/BZwqqY07tHWX1Zu2rXzg0tTF5QWM6Eww0bGJcHaMosGdMDV6yFyAcqFg6Crp4OC8hJYmFnwb2PsOLAX8XFRuEb37NerNyyMNANWFZKTU5ix82FACqNSqTHqhWdhyNh9+txF7N67DznU8vRsmfFF745IFM3dG+Ot1yfICpDooHCuoiZYrQG3bN+BDT/8ysxjTTKbDm/P5vhi8Tw0rqIm9iAETztKyaPLkSwoKoaHQ1M5slWhqW8rdGHi2E2hbmjeEJ39WqKAiWLLr7sw990ZMDY3x8GjJ+Hv1Rx2dE8TU2OkpKbCWMeAieYa4uIj4OpggVvJYuZlwd6qEcm5ZvaJtZOkpATOTBvZGbbll62ycCAoSBmvcTAngb+/P2aS091KSkJcQqIs4qr5z8HegcZy5Cy3Qwil6dkzZzDmpaqr7VXGwKCQG1j85Sq5WFOQn4OeXTtg/XcrajWeQDwvJC4hngFeC4UFhfBq2VJedHXo0rMb3nh1DF59/hk0a+yEK9fDOPqmclEpLjEBiaQlzT084OLiBDMax4reoEIpTp4/Q/XCMFCUz6ysoka14WBbygwtQk9MZBh/l2P1unVY+uUylDH3Ghjry5U6UXYzY/wVUDFJOTs7o2vnTtKzBg14Gm1a+8llhPXrN2DVN6swaNBg6FNBVYWHDCioyicLv2DMyEYpCWm3jm2w7IuFshRVF4SFR0jhXcb4JqiGiC+1wYDUpHN7XzL8Yhw7ITKdL2eSEc4yJpox/rT08JTdW6VUARZm5rChsVKzUmFipEI+qZO5uTXpkyWTiobbFRUVICM7Gz/9vBPfffcTrlwNJYc0lTyyhCpHxEjrP6yZCAgCfiM0FGvXrcfYV8bj/PkLmDx5Muztq47hAg8ZcOv2Xbh2/SaMGB/SUlMw8Om+spZXV4TcuCl6Jpn2Cxj7HODdSpOVa4KQbqJDy8baFn16PIEJr7wkByHw6jX4eHnBycFBDoialEWQ6yxSmPScdJgY6iKbN93YyRW6vBVTc00FPPh6MBYu/gpff7tOKhmBkuJS5GRmk3QXkjPqSzbxO9Q09s8Y/eJYjH9tEjZv3opWTJCffPJxJSpUFSoZMC8/Dz9v2Uamrw9dbV28O/tN7NqzE3eS664bbyUm0X4qydm6desoiwe1IY/GFotFndq2xbwP32eoaISQqHApCTu2a6spwtIttWhAoVAiyQuLSgsZ8Jk0mKiakoiLBSNb2wZISIjF9JlzcOHCVbm2osWEMW3K6/jph+/QqX1rmJNIv/Cf5yT9qcAx8tQ1q9dAi6HguWFDsXzZEsyYNQN2jIG1oZIBjxw/iZvhMShgRhrYvwemTpqAfn36Yt6nC5QjaoZYuE6hehANk4YG+niqfx9lT/UQ8aq8vEz20IhZUiorHWqcCbwk5Zaft5dsbasgzEJViOaj0oJcpPM6Tc3t0NDGDldDghHN7bPnfISIqDi6qCWpkCkWfTYP4159Be7uTfD992tx+uQRjBzxgjyXQGZWFg79dhSff74AG75bjWnTpsCzGnpWFSoZ8Pjps9JVbCxN8fqEsXLbsGeekZlt+cpV8nVNiKFwT02jHuY5OrZrQ57oqeypHiJrC7Uh7KNmzBQul5WThXOBAfKmHRo2QLkMqJrjy2jstv5t4GrngFRSKxd7F+n+MfHxmPvRxzhzNpDZ2oSf3QQb169Fv359NW8kxCBUtIJUYNu27QgiVWrbtr2kXfXFfQOKkQgNDRc1fgxi3Htw+r4/eybl2DHs3X9Q2VI1hDFuJ6fyQssxbuwIZWvNEIUCHc4+lVpjIdnNxUzewNwIwwb1onFEuYBgXBVGFp/h6+mDOTM+weghI+DO7CzWc4OCo8kHo2nnMvTr/QS+W7MKrnTt2iCI+M2IWHy7Zp2ypX64b8CIyGjcunUHpsaGeGboQGWrBiKWzH1/NhZ/sVQK9eogsq6gB25ujUmOH+6cqkARuZ646bt3Nd1TAsKVRUlQGEiPMW9Y/0Fo4dqEHlEmLSf4mTi/igeVFDNmMkYP6EPK0coXoWFRSEy6QyJciqmTX8NXy5bC1LRyZ1d1EIUOwQ8/X/IVE8kvyta6474BE0kmMzKy0NStETw9NGsaD6I1NaBY933z7RkU5jeUrZVx/PRFODo5IyoiEpuruRihSVdxtH/cvAU79lABkG6IQkApiW8xjVlcUkTBbwefZi2hpvbMys6iXi2QmVqzWC/nI48rQRFjbn5mLqJj4mkEbcyfNwdvTntYbtWEzp06SK6r0tbDBx8vxImTp5Q9dcN9A6akpEl3auPvrVzowxg6eBBGvDAcr06YRIpxVdmqQXxCAjKyCmUVRgj+M6dEBUZzsxUQwn3Hrj3w9vLE21OnokvHDpyNnIGcZXp0XQMDXamDdeXfhjAhLTFk1hWGFTNUFiWkq4t+mHKeLw93ed2ZVDNff7kYzz/3rOaD6oHhw4ejFZWOIP30Acx49yPEMpbXFfctJQKxOaVSkyY1x43J1IbDhg7BK+Mm4tDho8pWIComCfrGZrhD+dTUzRmmZiYPLaqfOHEK/n7e6PFEN1y6FoxtO/fAjAGftkGhrEhrSdpjRMKrZ8gfZnKRzS0YFoRuFdfIqcLjGOmoecWDOkm3bzPLjmXG7yc/o74Qz6B8/dUyODWwhIrnF21wny5YpOytHfcNKDpErS3NZQNPbZjx9jTZADl52nRKpe8lB7uTXogbN0Ohp1WGLu28Ec+smE0uWIHMzCxZBRGlprXrN2Lg0BF0vQTGTFNJTSoysJo3Uc5ZJiSZyIoGjMliXUTFWSpa2YoK8ugpJdKlRalJGKBHT01z5qOiMZPNt18vo3jgzKcdTp65gL37Dih7a8Z9A1oyUXh6tKB29VK21IwpkyYysczAkmXLMW3WR0hOy0DY9StwtDWHsb42qUcJDZitHE0XT7yFVLraS+Mm000+ZvpVw6tFU7lPhA7h7uKflrYWk0nFZYl+FR2pyQ0p90wNDZg8tKRUy8nKZszOgJu7u1zd+7Pw8fPFgvlzUUxXVnFAv1mzXoaj2nDfgHbUlw3tbGT5qa4QK/rLFy+EjY0DIsJCUJB7D3bWZpR++tSp+rLzU0AQZdEBNfXt2di3/zAaNrSXGdfORtP3V0GSxaySf4n/RPjkTBRxSQZGGk7FH30aU033FX0uIjY6OldumKwvRGwVHRTbtm0lC0lEM3dXudR6MyIa+w7UTNsE7hvQTXAm3qimCbvu6PVkT3h4tcLNGzdgoKeDxuRl4rYbcDB+/HEzfiN/HD9xEl1iPwz1DGlga86ee+hDrubl5UFtKh7t4j8aURQyNWlHY1CRL6QdxWXypphG5DEi/olElcoByn9gjVZAhIDakJqaikOHDuOLpcsw8fVJGDt2HD7+eD7Wb/gBgwf1p5CwgC4/b8fOfYp3VI/7rR2CvV+9FoRGjVxgyRPUFbFJKdh76AQiQq/Q/qVoYGvF+1cjKTkDJ84GYMuvO2FsZCLdUsRBYyM92Qj54QezZdNjYWE+9S11KWOcMJCAIOKSCdCAnHeKOYWc4/8lZUwe+UxQmdiydReWLVmBfOpvvbx8XD10EMlBwdAnB4xKSpRVlwrNGxMTg127dsuGp00//Yw9pFCXA68gOeUuE5kxE1t3vPf+e+jfrx9uJ93CpStByGGS6tm9Mz3MWp6jKlRqLhKzRJsX3r8eGe34+SCsXPU9IkIuyDpbUVGeZqGcpy1T6/BmizkgpkghaW7Xrh3mf/IBmjdrJt979uxZaHHWW1iIpUJmXCPGOH1dJhsDGDOBSNqixcgoXFhdImdpYX4hMtJSEEPyvGLRV7gdchMGJmYwa+ICi2buaN/cHRGXAnH8xnX069tXrmEcPXoC14KvI5nXINqIRV+MvYMDPFq0QMdOHdGmdetKLcHxcXEY8txIueL40Xvv4KXR1auqSgYUD6Ns374dr7widLBm3GuCeOvGXw5KGVRekI4hg5/CLmavrOwC6HAWaunoSn6lpSrDq2NfwhtMPA828Vy5chXpdzl79MSypAnKaCgLEwNZBdfizDHQ0RhULMIXFeVDn8cV5Rfw/Nmy0WfN6nXIYchRGxnJClA+s7IW1YgJX9PezOYlHDxjGs1UVrP9aahWTJKin9HV1VUuhVaHV8dPxMGjZ2UD/GefVt9/dT8GCoj2BTc3N/mQTF1QSpEfHR2LO7fj0KF9Gwx/9hnpxlpicUE8/8vfFuYm2LB2Fd6aNuWhDijxeeHR8SgoLcOhoydlDEpPiEbQ4e1IDrmMuNhw3GWAv0uXKiB9gUoPGfdysHnrTtmTfY9qBHpGUOUWooxJxZiz1cbcHC6OLkxg6dItv9+wAb9u+wWbNv2A6e+8jX50UU9PzxqNJyCq06akWHHxiRy86lfuKhlQoHv37oiKjsKdO3eULdWjsKgE0bGxjEuFePHFEdItDI1NZNZVM6bl86bEY67t2lXuS66AeJzr0JGT+GTBcmzYtBUNrM1hXk5OefU4rh7Ygpz0Ozh34SxiYmMQGRGFlSu/xquvT8E3q9fjdmIytEX5qygXhZxp4vkQI1ML5OflMd6FkfpooxkJvbOz6J4VXQ6a+FoXiN6Xs+fOIyszG7Hi0QvG7urwkAFF8O7Tpw8D9FakcxRrQgLlW+Dli+j5RBf4+/rK91pyBgg6IqrHxcxgNdXWhOuKZ4hTUzM4IwyhKqLxYoLg5dEQzb2bwd7FDRt/2IJV6zdhwcKlWEWXTbqVJF1UxMYC0pi83HxpPBF/BcHu0M4Xvbp3hJWFCWIib+BWfN1lmUBSUhJGjx4rH3ews7OWhWHxiER1eMiAAmI1qmePHli2/Es5+tXBztYSCz6cjk8+fF++FhnPjMqgvEzQEh0mE02pviqI/pppb81AcFAQJaQB7El7wqJTsXZvEDb8dgNhSdkopduKCwwIDKayuS11segqzc3NhhEzt+h4HTzwafi09JAFh9y8HKoKF6Qk0+0KchAUHIySWmjIg9i2YwcGDh4GUxMj7NmxDX4tWyAnO4sDU6Yc8TCqXdb0btWKCaAAS8mVBjw9QHZx/hG2NjYYOrhy6atta38co1vm5WVxphigtf/DXVDiIZmPPv4U12i83r16ytpjVFQM8nnT+TCirk5BjjoE2uYNmIxA/qjHQSmHAWNoh44d5DMbLs6O0COxbsKMLvqz33pnJtJTMnDuzHn4ejUhr3VDC7Ga16j2lcTLlwOx5IvluHL1Kt55axrGjdMUk6VOpzfVhBoX1gXtMCWX+mb1Ghw/dRpDBg2glm1bbbVGwMnJAUOGPCUXokQfiXjmtwKREZHYvWc/fvp5C7mVJTasW4Nu3brKfeMnvIGzvHkne1sYmpgiMikVQSvXIa9QuKeeJLRmpg0lb2ve1A1tGVcdGjaElfJgo1crL+QHXKGeN0VTd7FIX8oZq3mYsCqIytC5sxfIU7fh8OFDaNmyJbZu/hHePr8/YttQdJmRTQhqVx1qNKCABzPWnPfexYaNG/HZoi9kUO7SpQP8vL3lYwci9jyIyPBwjuJUEvJG8nVUVDRnWjBOnT6D69dDkJOTQ7LaCxMmjKexNSv9YhFcdNDb2NlCxVmWT6qST/6oRR3csXM76Momy3KqjkLejBojR41gAqrcJSD6ncNCQ5k5DVDM48TCWFLSHWRTM4v+HBFKhAIRfdIXAi5Rifwmn9VzaeSEWTPfwctjxtwn3RUwpBy1sjKXBYvqUK8u/Uuc6tt27ELozXBZALWlLLNraAdbuqBo8BFudvbcOc66prIRSJSa7txNQXbmPZhS8Ldt44fBQwbjie5PKGfUQIj2554fjcTEeKkeSotLZDzr3Kk9Vq9ZrRxVM6KiIvHMc8PRztcT3du34nkMcDrgBu6ml3KWWiImLlYmIGFEAwN9tPT0oqcMxEDGUBtrzSz+IxYtWYwz56imftwoy2xVod6POYjDw8MjcP5CgGT3CbduyaqIKM0LA+rq6sjlUX26jli8dqRLt/LyQteuXeDnV7mzqQLRnKWDhjwPEzMzFBcVyLijIjWey+Q0ZMhQ5aja8eprExAUeA0DenfgwNpi+55jCAmLlkuhLs7OZAo+6NChnWz3FaGloohRHeYvmE/JmIOFn1W/KllvAz4IsUKWnpYhe0vELBJuosm6allXE49V2dItxWJ4TQgPC8egwc/D1MJS1vyEEc3MTPDjpu/R5IFHVmvDosVLpCoyYObR1tGngbTwzvQ3qD585Hmq6tqqDqJgMXPmTPj6+mPUqJHK1odRfXSsA8RT4XY0kBjRztSUXbt0Rncmhe7duqF9+/YMwva1Gk/AiVnVycle1g9FTVA8ACj+Fg9p1wdCg4vuU+gYoZi/HJwc8fyzw+Hj41Mv4wkIrxIVdT/eW034UwZ8XBAF0blzZ8uvfLqbfBuDGJfWrf0WR377jTLxtnJU3VBcWEwTUhkzDNhaW0j3fRSIDllLK8v6tXb8L9GtW3cc2LcT+/bsxIrly8j3Okrduvrb2hf0K1DMxFbOiCRlG8ObNZPco+LChfNUWNU/NV+Bv40BBezJu1qTiMvCH9Gla1cYcXZ+//0G+bomiFB+kzRGNIOKv8VPA7vKT6fXFULOCfft2bP2L5/4WxmwKrw8dixOnjyOPbt3KVuqxoljRxARHqYUYpnDmcwedQbu3LEdQ4c8Uyf3/9sb0MbGFlOmTMMmZuRftmxRtlaGkHLr16/HsGHD0NDWCmnJKbAieRbUqb7YsX0bGrs1piLxUbbUAkFj/gk4fvyY+qn+fdTLl3+pzsvLVbZqsODTeepZs6bLv1NSUtSbN29RUzbK1/XBrp071L9u3aK8qhv+MQYUOHP6lHrgoIHq0S++qD516qS6uLhIvXXrL+rnnxuivnPntnJU/ZGVmale9c0K9e6d25UtdcefItL/C0RERGLliq9wI/QGXF3dkJqWikmvT0SfPr+3sdUVQj0dZ+w8f+EcevfuS43fTdlTd/zjDCggvshs/4EDcpVNdM+KumDbNm3h599aLkn88TtjHoR46FtwvGtXAxF6I0R+p9dzzw9Hgwbi+b764x9pwAqIh2GOHj2CUydPyeb2Mmpx8YUXor4oWvLc3d0lLywnqRZfuhMXF81ZVyJLdC1beqJXrz5wa+KunO3R8I82YAVEh4Jw6aDgIFKZcLm6KL7wVjyTLMi1UHfiK+58fL3lcoWnp9cjf/vHH/H/woB/hFhFS0/PkFxQ06mgkg/7VDwb8jjx/9KA/0387Yn03x3/GvBP4l8D/ikA/wdii0RKstSaQgAAAABJRU5ErkJggg==';



const BLETimeout = 4500;
const BLESendInterval = 20;
const BLEDataStoppedError = 'AI Drone extension stopped receiving data';


const BLEUUID = {
    service: 0x2261,
    rxChar: '00000227-0000-1000-8000-00805f9b34fb',
    txChar: '00000227-0000-1000-8000-00805f9b34fb'
};


class AIDrone {
    constructor (runtime, extensionId) {
        this._runtime = runtime;
        this._ble = null;
        this._runtime.registerPeripheralExtension(extensionId, this);
        this._extensionId = extensionId;
				this._runtime.on('PROJECT_STOP_ALL', this.stopAll.bind(this));
        this._timeoutID = null;
        this._busy = false;
        this._busyTimeoutID = null;
        this.reset = this.reset.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);
        this._pollValues = this._pollValues.bind(this);
        this.rxData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.txData = new Int16Array(7);
        this.txArray = new Uint8Array(14);
        this._pollingIntervalID = null;
        this._pollingInterval = 25;
        this.moveX = 0;
        this.moveY = 0;
        this.rotation = 0;    
        this.isFlying = 0;    
        this.armDisableCnt=0;
        this._sensors = {
            button: 0,
            ir: [0, 0, 0],
            ultrasonic: 0,
            joystick: [0, 0],
            tilt: [0, 0],
            sound: 0,
            illum:0
        };
        this.stopAll();
    }
    
		stopAll () {
				for (let i = 0; i < 7; i++)
						this.txData[i] = 0;
				this.txData[4] = 0x01;
				this.txData[5] = 100;
	      this.txData[6] = 100;		
				this.moveX = 0;
	      this.moveY = 0;
	      this.rotation = 0;
	      this.isFlying = 0;
		}
		
    scan () {
        if (this._ble) {
            this._ble.disconnect();
        }
        this._ble = new BLE(this._runtime, this._extensionId, {
            filters: [
                {services: [BLEUUID.service]}
            ]
        }, this._onConnect, this.reset);
    }

    connect (id) {
        if (this._ble) {
            this._ble.connectPeripheral(id);
        }
    }

    disconnect () {
        if (this._ble) {
            this._ble.disconnect();
        }
        this.reset();
    }

    reset () {
    		console.log("reset");
        if (this._timeoutID) {
            window.clearTimeout(this._timeoutID);
            this._timeoutID = null;
        }
    }

    isConnected () {
    	
        let connected = false;
        if (this._ble) {
            connected = this._ble.isConnected();
        }
        return connected;
    }


    _onConnect () {
    		this._pollingIntervalID = window.setInterval(this._pollValues, this._pollingInterval);
        this._ble.read(BLEUUID.service, BLEUUID.rxChar, true, this._onMessage);
        this._timeoutID = window.setTimeout(
            () => this._ble.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
    }

		_pollValues () {
    		if (!this.isConnected()) {
            window.clearInterval(this._pollingIntervalID);
            return;
        }
        if(this.armDisableCnt>0){
        		this.armDisableCnt -= 1;
        		if(this.armDisableCnt==0)
        				this.txData[4] = 1;
        }

				for(let n=0;n<7;n++){
				    this.txArray[n*2] = this.txData[n]&0xFF;
				    this.txArray[n*2+1] = (this.txData[n]>>8)&0xFF;
				}
        this._ble.write(BLEUUID.service, BLEUUID.txChar, this.txArray, 'ASCII', true).then(
            () => {
                this._busy = false;
                window.clearTimeout(this._busyTimeoutID);
            }
        );
     }

    _onMessage (strData) {
      	this.rxData = strData.split(',');
      	if(this.isFlying && (this.rxData[0]&0x01)){
      			this.stopAll();
      			this.txData[4] = 0;
      			this.isFlying = 0;
      			this.armDisableCnt=5;
      	}
        window.clearTimeout(this._timeoutID);
        this._timeoutID = window.setTimeout(
            () => this._ble.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
    }
    
    get getRxData() {
        return this.rxData;
    }
    
    get getTxData() {
        return this.rxData;
    }
}

class Scratch3AIDroneBlocks {
    static get EXTENSION_NAME () {
        return 'AIDrone';
    }
    static get EXTENSION_ID () {
        return 'aidrone';
    }

    constructor (runtime) {

        this.runtime = runtime;
        this._peripheral = new AIDrone(this.runtime, Scratch3AIDroneBlocks.EXTENSION_ID);
        this.message = this._peripheral.txData;
        this.tuneID = 0;
        this.moveID = 0;
        this.rotID = 0;
    }


    getInfo () {
        return {
            id: Scratch3AIDroneBlocks.EXTENSION_ID,
            name: Scratch3AIDroneBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'takeoff',
                    text: formatMessage({
                        id: 'takeoff',
                        default: 'Take Off',
                    }),
                },
                {
                    opcode: 'landing',
                    text: formatMessage({
                        id: 'landing',
                        default: 'Landing',
                    }),
                },
                {
                    opcode: 'alt',
                    text: formatMessage({
                        id: 'alt',
                        default: 'Fly up [TEXT] in/cm',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                
                {
                    opcode: 'velocity',
                    text: formatMessage({
                        id: 'velocity',
                        default: 'Fly [FBRL] [TEXT] cm/s',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	FBRL: {
                            type: ArgumentType.STRING,
                            menu: 'fbrl',
                            defaultValue: 'forward'
                        },
                        TEXT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 70
                        }
                    }
                },
                
                 {
                    opcode: 'move',
                    text: formatMessage({
                        id: 'move',
                        default: 'Fly [FBRL] [TEXT1] cm at [TEXT2] cm/s',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	FBRL: {
                            type: ArgumentType.STRING,
                            menu: 'fbrl',
                            defaultValue: 'forward'
                        },
                        TEXT1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        TEXT2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                
                {
                    opcode: 'rotation',
                    text: formatMessage({
                        id: 'rotation',
                        default: 'Yaw [ROTDIR] [TEXT1] degree [TEXT2] deg/s',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	ROTDIR: {
                            type: ArgumentType.STRING,
                            menu: 'rotdir',
                            defaultValue: 'Clockwise'
                        },
                        TEXT1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        },
                        TEXT2: {
                            type: ArgumentType.STRING,
                            defaultValue: 70
                        }
                    }
                },
                {
                    opcode: 'proprot',
                    text: formatMessage({
                        id: 'proprot',
                        default: 'Propeller speed [TEXT]',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	TEXT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'motorot',
                    text: formatMessage({
                        id: 'motorot',
                        default: '[LTRB] Motor speed [TEXT]',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	LTRB: {
                            type: ArgumentType.STRING,
                            menu: 'ltrb',
                            defaultValue: 'left_down'
                        },
                        TEXT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'emergency',
                    text: formatMessage({
                        id: 'emergency',
                        default: 'Fly Stop',
                    }),
                },
                '---',
                {
                    opcode: 'getready',
                    text: formatMessage({
                        id: 'getready',
                        default: 'Ready to Fly',
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'getbattery',
                    text: formatMessage({
                        id: 'getbattery',
                        default: 'Battery(%)',
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'getalt',
                    text: formatMessage({
                        id: 'getalt',
                        default: 'height',
                    }),
                    blockType: BlockType.REPORTER,
                },
               {
                    opcode: 'gettilt',
                    text: formatMessage({
                        id: 'gettilt',
                        default: '[FBLR] Degree',
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                       	FBLR: {
                            type: ArgumentType.STRING,
                            menu: 'fblr',
                            defaultValue: 'forward_backward'
                        },
                    }
                },
              	{
                    opcode: 'getmove',
                    text: formatMessage({
                        id: 'getmove',
                        default: 'Move [FBLR]',
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                       	FBLR: {
                            type: ArgumentType.STRING,
                            menu: 'fblr',
                            defaultValue: 'forward_backward'
                        },
                    }
                },
            ],
           	menus: {
                fbrl: {
                    acceptReporters: true,
                    items: ['forward', 'backward','right', 'left']
                },
                rotdir: {
                    acceptReporters: true,
                    items: ['Clockwise', 'Counterclockwise']
                },
                fblr: {
                    acceptReporters: true,
                    items: ['forward_backward', 'left_right']
                },
                ltrb: {
                    acceptReporters: true,
                    items: ['left_down', 'left_up', 'right_down', 'right_up']
                },
            }
        };
    }
    
    takeoff () {
    		if(this.getready()==0)
    				return;
    		this._peripheral.stopAll();
    		this.message[3] = 70;
    		this.message[4] = 0x2F;
    		this._peripheral.isFlying = 1;
    }
    
    landing () {
    		this.message[3] = 0x0;
    		this._peripheral.isFlying = 0;
    }
    
    alt(args){
    		if(this._peripheral.isFlying==0)
    				return;
    		var value = args.TEXT>150? 150 : args.TEXT<0? 0 : Number(args.TEXT);
    		this.message[3] = value;
    }
    
    velocity(args){
    	  if(this._peripheral.isFlying==0)
    				return;
    		var vel = args.TEXT>200? 200 : args.TEXT<0? 0 : Number(args.TEXT);
    		if(args.FBRL == 'forward') this.message[1] = vel;
				if(args.FBRL == 'backward') this.message[1] = vel*-1;
    		if(args.FBRL == 'right') this.message[0] = vel;
				if(args.FBRL == 'left') this.message[0] = vel*-1;
				this.message[4] &= ~0x20;
    }
    
    move (args){
    		if(this._peripheral.isFlying==0)
    				return;
    		var dist = args.TEXT1>2000? 2000 : args.TEXT1<0? 0 : Number(args.TEXT1); 
    		var vel = args.TEXT2>200? 200 : args.TEXT2<0? 0 : Number(args.TEXT2); 
    		if(args.FBRL == 'forward') this._peripheral.moveY += dist; 
				if(args.FBRL == 'backward') this._peripheral.moveY += (-1*dist); 
    		if(args.FBRL == 'right') this._peripheral.moveX += dist; 
				if(args.FBRL == 'left') this._peripheral.moveX += (-1*dist);
				this.message[0] = this._peripheral.moveX;
				this.message[1] = this._peripheral.moveY;
				this.message[4] |= 0x20;
    	  this.message[5] = vel;
    }
    
    rotation (args){
    		if(this._peripheral.isFlying==0)
    				return;    	
    		var degree = args.TEXT1>179? 179 : args.TEXT1<0? 0 : Number(args.TEXT1);
    		var vel = args.TEXT2>200? 200 : args.TEXT2<0? 0 : Number(args.TEXT2); 
    		if(args.ROTDIR == 'Clockwise') this._peripheral.rotation += degree; 
				else this.message[2] = this._peripheral.rotation += (-1*degree); 
				this.message[2] = this._peripheral.rotation;	
    	  this.message[6] = vel;
    }
    
    proprot (args){
    		var speed = args.TEXT>100? 1000 : args.TEXT<0? 0 : Number(args.TEXT)*10;
    		this.message[3] = speed;
				this.message[4] = 0x01;
    }

    motorot (args){
    		var speed = args.TEXT>100? 100 : args.TEXT<0? 0 : Number(args.TEXT);
    		if(args.LTRB == 'left_down') this.message[2] = speed;
				if(args.LTRB == 'left_up') this.message[1] = speed;
				if(args.LTRB == 'right_down') this.message[3] = speed;
				if(args.LTRB == 'right_up') this.message[0] = speed;
				this.message[4] = 0x8000;
    }
    
    emergency (args){
    		this._peripheral.isFlying=0;
    		this._peripheral.moveX = 0;
    		this._peripheral.moveY = 0;
    		this._peripheral.rotation = 0;
    		for (let i = 0; i < 7; i++)
						this.message[i] = 0;
				this.message[5] = 100;
      	this.message[6] = 100;		
    }
    

    getready(){
	    	var rxData = this._peripheral.rxData;
	    	if((rxData[0]&0x03) == 0)
	    			return 1;
	    	else
	    			return 0;
    }
    
    getbattery(){
    		var rxData = this._peripheral.rxData;
    		return rxData[1];
    }
    
    getalt(){
    		var rxData = this._peripheral.rxData;
    		return rxData[4];
    }
    
    gettilt(args){
	    	var rxData = this._peripheral.rxData;
				if(args.FBLR == 'left_right')
						return rxData[2]>127? rxData[2]-256 : rxData[2];
	    	else
	    			return rxData[3]>127? rxData[3]-256 : rxData[3];
    }
    
    getmove(args){
    	var rxData = this._peripheral.rxData;
    	if(args.FBLR == 'left_right'){
	    		var dist = (rxData[6]<<8) | rxData[5];
	    		return dist>0x7FFF? dist-0x10000 : dist;
    		
    	}
    	else{
	    		var dist = (rxData[8]<<8) | rxData[7];
	    		return dist>0x7FFF? dist-0x10000 : dist;
    	}
    }
}

module.exports = Scratch3AIDroneBlocks;
