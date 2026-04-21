<?php

namespace App\Support;

use App\Models\Resource;
use Illuminate\Http\Request;

class ResourceViewRecorder
{
    private const COOLDOWN_SECONDS = 1800;

    public function record(Request $request, Resource $resource): bool
    {
        if (! $this->shouldRecord($request, $resource)) {
            return false;
        }

        $resource->incrementViewCount();
        $this->rememberView($request, $resource);

        return true;
    }

    private function shouldRecord(Request $request, Resource $resource): bool
    {
        if ($request->prefetch()) {
            return false;
        }

        if (! $request->hasSession()) {
            return true;
        }

        $lastViewedAt = $request->session()->get($this->sessionKey($resource));

        if (! is_int($lastViewedAt) && ! ctype_digit((string) $lastViewedAt)) {
            return true;
        }

        return (int) $lastViewedAt <= now()->subSeconds(self::COOLDOWN_SECONDS)->getTimestamp();
    }

    private function rememberView(Request $request, Resource $resource): void
    {
        if (! $request->hasSession()) {
            return;
        }

        $request->session()->put(
            $this->sessionKey($resource),
            now()->getTimestamp(),
        );
    }

    private function sessionKey(Resource $resource): string
    {
        return 'resource_views.'.$resource->getKey();
    }
}
