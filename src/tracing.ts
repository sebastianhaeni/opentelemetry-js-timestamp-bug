import {SimpleSpanProcessor} from '@opentelemetry/sdk-trace-base';
import {WebTracerProvider} from '@opentelemetry/sdk-trace-web';
import {Resource} from "@opentelemetry/resources";
import {ZoneContextManager} from '@opentelemetry/context-zone';
import {ExportResult, ExportResultCode, hrTimeToMicroseconds, W3CTraceContextPropagator} from '@opentelemetry/core';
import {SpanExporter} from "@opentelemetry/sdk-trace-base/build/src/export/SpanExporter";
import {ReadableSpan} from "@opentelemetry/sdk-trace-base/build/src/export/ReadableSpan";

const SERVICE_NAME = "otel-react";

const resource = new Resource({"service.name": SERVICE_NAME});

class MyConsoleExporter implements SpanExporter {
  export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void) {
    for (const span of spans) {
      const timestamp = new Date(hrTimeToMicroseconds(span.startTime) / 1000);
      const current = new Date();
      console.table({
        name: span.name,
        startTimeHr: JSON.stringify(span.startTime),
        durationHr: JSON.stringify(span.duration),
        timestamp: hrTimeToMicroseconds(span.startTime),
        duration: hrTimeToMicroseconds(span.duration),
        timestampIso: timestamp.toISOString(),
        currentIso: current.toISOString(),
        diff: `${(current.getTime() - timestamp.getTime()) / 1000 / 60 / 60} hours`,
      });
    }
    if (resultCallback) {
      return resultCallback({code: ExportResultCode.SUCCESS});
    }
  }

  shutdown() {
    return Promise.resolve();
  }
}

const tracerProvider = new WebTracerProvider({resource});
tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new MyConsoleExporter()));

tracerProvider.register({
  contextManager: new ZoneContextManager(),
  propagator: new W3CTraceContextPropagator(),
});

export const tracer = tracerProvider.getTracer(SERVICE_NAME);
