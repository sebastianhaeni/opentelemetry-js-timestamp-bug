import './tracing'
import {tracer} from "./tracing";
import {Span} from "@opentelemetry/api";

let span: Span | undefined;

function main() {
  setTimeout(() => {
    console.log('Starting span');
    span = tracer.startSpan('customSpan');
  }, 500);

  setTimeout(() => {
    console.log('Ending span');
    span?.end();
  }, 1500);
}

main();
