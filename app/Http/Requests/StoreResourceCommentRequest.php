<?php

namespace App\Http\Requests;

use App\Support\SanitizedHtml;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreResourceCommentRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('body'))) {
            $this->merge([
                'body' => SanitizedHtml::cleanComment(trim($this->input('body'))),
            ]);
        }
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'body' => ['required', 'string'],
        ];
    }

    /**
     * Get the "after" validation callables for the request.
     *
     * @return list<callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $length = mb_strlen(SanitizedHtml::plainText($this->string('body')->toString()));

                if ($length === 0) {
                    $validator->errors()->add('body', '评论内容不能为空。');
                }

                if ($length > 500) {
                    $validator->errors()->add('body', '评论内容不能超过 500 个字符。');
                }
            },
        ];
    }
}
