const QRCodeStyling = require("qr-code-styling");
class QrStylingOptionsBuilder {
    constructor() {
      this._options = {
        width: 300,
        height: 300,
        type: "canvas",
        data: "",
        image: "",
        margin: 0,
        qrOptions: {
          typeNumber: 0,
          mode: "Numeric",
          errorCorrectionLevel: "Q",
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.4,
          margin: 0,
        },
        dotsOptions: {
          color: "#000",
          type: "square",
        },
        cornersSquareOptions: {
          type: "dot",
        },
        cornersDotOptions: {
          type: "dot",
        },
        backgroundOptions: {
          color: "#fff",
        },
      };
    }
  
    /**
     * Устанавливает ширину QR-кода
     * @param {number} width - Ширина
     * @returns {QrStylingOptionsBuilder}
     */
    setWidth(width) {
      this._options.width = width;
      return this;
    }
  
    /**
     * Устанавливает высоту QR-кода
     * @param {number} height - Высота
     * @returns {QrStylingOptionsBuilder}
     */
    setHeight(height) {
      this._options.height = height;
      return this;
    }
  
    /**
     * Устанавливает тип элемента, который будет отрисован
     * @param {string} type - Тип ('canvas' 'svg')
     * @returns {QrStylingOptionsBuilder}
     */
    setType(type) {
      this._options.type = type;
      return this;
    }
  
    /**
     * Устанавливает данные, которые будут закодированы в QR-код
     * @param {string} data - Данные
     * @returns {QrStylingOptionsBuilder}
     */
    setData(data) {
      this._options.data = data;
      return this;
    }
  
    /**
     * Устанавливает изображение, которое будет скопировано в центр QR-кода
     * @param {string} image - URL изображения
     * @returns {QrStylingOptionsBuilder}
     */
    setImage(image) {
      this._options.image = image;
      return this;
    }
  
    /**
     * Устанавливает отступы вокруг холста
     * @param {number} margin - Отступы
     * @returns {QrStylingOptionsBuilder}
     */
    setMargin(margin) {
      this._options.margin = margin;
      return this;
    }
  
    /**
     * Устанавливает опции QR-кода
     * @param {QrOptions} qrOptions - Опции
     * @returns {QrStylingOptionsBuilder}
     */
    setQrOptions(qrOptions) {
      this._options.qrOptions = qrOptions;
      return this;
    }
  
    /**
     * Устанавливает опции изображения
     * @param {ImageOptions} imageOptions - Опции
     * @returns {QrStylingOptionsBuilder}
     */
    setImageOptions(imageOptions) {
      this._options.imageOptions = imageOptions;
      return this;
    }
  
    /**
     * Устанавливает опции стилизации точек QR-кода
     * @param {DotsOptions} dotsOptions - Опции
     * @returns {QrStylingOptionsBuilder}
     */
    setDotsOptions(dotsOptions) {
      this._options.dotsOptions = dotsOptions;
      return this;
    }
  
    /**
     * Устанавливает опции стилизации квадратов в углах QR-кода
     * @param {CornersSquareOptions} cornersSquareOptions - Опции
     * @returns {QrStylingOptionsBuilder}
     */
    setCornersSquareOptions(cornersSquareOptions) {
      this._options.cornersSquareOptions = cornersSquareOptions;
      return this;
    }
  


    /**
     * Устанавливает опции стилизации точек в углах QR-кода
     * @param {CornersDotOptions} cornersDotOptions - Опции
     * @returns {QrStylingOptionsBuilder}
     */
    setCornersDotOptions(cornersDotOptions) {
      this._options.cornersDotOptions = cornersDotOptions;
      return this;
    }
      
/**
   * Устанавливает опции стилизации фона QR-кода
   * @param {BackgroundOptions} backgroundOptions - Опции
   * @returns {QrStylingOptionsBuilder}
   */
  setBackgroundOptions(backgroundOptions) {
    this._options.backgroundOptions = backgroundOptions;
    return this;
  }

  /**
   * Возвращает объект QrStylingOptions
   * @returns {QrStylingOptions}
   */
  build() {
        return this._options;
  }
}
module.exports = function(RED) {
    function QRCodeGeneratorNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg) {
            const builder = new QrStylingOptionsBuilder();
            if (msg.payload.data) {
                if (msg.payload.qrType) {
                    switch (msg.payload.qrType) {
                        case "text":
                            builder.setData(msg.payload.data);
                            break;
                        case "location":
                            builder.setData(`geo:${msg.payload.data.latitude},${msg.payload.data.longitude}`);
                            break;
                        case "email":
                            builder.setData(`mailto:${msg.payload.data.email}?subject=${encodeURIComponent(msg.payload.data.subject)}&body=${encodeURIComponent(msg.payload.data.body)}`);
                            break;
                        case "sms":
                            builder.setData(`sms:${msg.payload.data.phone}?body=${encodeURIComponent(msg.payload.data.message)}`);
                            break;
                        case "wifi":
                            const encryption = msg.payload.data.encryption ? `T:${msg.payload.data.encryption};` : "";
                            const password = msg.payload.data.password ? `P:${msg.payload.data.password};` : "";
                            builder.setData(`WIFI:S:${msg.payload.data.ssid};${encryption}${password};`);
                            break;
                        case "event":
                            const start = msg.payload.data.start ? `D:${msg.payload.data.start}` : "";
                            const end = msg.payload.data.end ? `/${msg.payload.data.end}` : "";
                            builder.setData(`BEGIN:VEVENT\nSUMMARY:${msg.payload.data.summary}\nLOCATION:${msg.payload.data.location}\nDESCRIPTION:${msg.payload.data.description}\n${start}${end}\nEND:VEVENT`);
                            break;
                        case "vcard":
                            builder.setData(`BEGIN:VCARD\nVERSION:4.0\nN:${msg.payload.data.lastName};${msg.payload.data.firstName};;;\nFN:${msg.payload.data.firstName} ${msg.payload.data.lastName}\nORG:${msg.payload.data.organization}\nTEL;TYPE=work,voice;VALUE=uri:tel:${msg.payload.data.phone}\nEMAIL:${msg.payload.data.email}\nEND:VCARD`);
                            break;
                        case "url":
                                // Обработка URL аналогично предыдущему примеру
                                if (typeof msg.payload.data === "string") {
                                    builder.setData(msg.payload.data);
                                } else if (typeof msg.payload.data === "object" && msg.payload.data.baseUrl) {
                                    const { baseUrl, queryParams, queryString } = msg.payload.data;
                                    let url = baseUrl;
                                    if (queryString) {
                                        url += `?${queryString}`;
                                    } else if (queryParams) {
                                        const queryStr = Object.keys(queryParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`).join('&');
                                        url += `?${queryStr}`;
                                    }
                                    builder.setData(url);
                                } else {
                                    node.error("Invalid URL data format", msg);
                                    return;
                                }
                                break;
                            default:
                                builder.setData("Invalid QR Type");
                        }
                    } else {
                        builder.setData(msg.payload.data);
                    }
                }
            // Устанавливаем значения по умолчанию
                   builder.setWidth(config.width || 300)
                          .setHeight(config.height || 300)
                          .setType(config.type || "canvas")
                          .setMargin(config.margin || 0)
                          .setQrOptions(config.qrOptions || {})
                          .setImageOptions(config.imageOptions || {})
                          .setDotsOptions(config.dotsOptions || {})
                          .setCornersSquareOptions(config.cornersSquareOptions || {})
                          .setCornersDotOptions(config.cornersDotOptions || {})
                          .setBackgroundOptions(config.backgroundOptions || {});
             // Генерируем QR-код
             const qrCode = new QRCodeStyling(builder.build());
             qrCode.getRawData(msg.payload.type || "canvas").then((buffer) => {
                 msg.payload = {
                     image: buffer.toString('base64'),
                     mimeType: `image/${msg.payload.type || "png"}`
                 };
                 node.send(msg);
             }).catch((error) => {
                 node.error("Error generating QR code: " + error, msg);
             });
         });
     }
     RED.nodes.registerType("qr-code-generator", QRCodeGeneratorNode);
 }