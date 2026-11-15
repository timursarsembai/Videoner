# Local model sources

Weights are downloaded separately into a cache, not included in this repository.

- Tile classifier: [VeyraAgent/cf-solver-models](https://huggingface.co/VeyraAgent/cf-solver-models), revision `0257291b5110eeab7d13cab98907ab1347559e22`, file `solvers/recaptcha/models/recaptcha_cls_s.onnx`. The model's embedded metadata declares AGPL-3.0 (the collection's card says MIT). Based on the reCAPTCHA 57k dataset. Exact file size and SHA-256 are checked before loading. Input size 224 and class order were verified against the embedded metadata; no publisher Python implementation is imported.
- Object localization: [Xenova/yolos-tiny](https://huggingface.co/Xenova/yolos-tiny), revision `e2f9c7673f0fa61849efe2b56a0d7774779ebb9d` (ONNX conversion of hustvl/yolos-tiny).
- Optional speech recognition: [Xenova/whisper-tiny.en](https://huggingface.co/Xenova/whisper-tiny.en), revision `79fb389fc764e7c395bd330e9531d9d32ada7049` (ONNX conversion of OpenAI Whisper).

Only ONNX data is loaded, never publisher Python code or pickle checkpoints.
The service is experimental and is not distributed as a production image.
