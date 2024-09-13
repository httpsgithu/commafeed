package com.commafeed.backend.feed.parser;

import java.nio.charset.Charset;
import java.util.Optional;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.mozilla.universalchardet.UniversalDetector;

import jakarta.inject.Singleton;

@Singleton
class EncodingDetector {

	/**
	 * Detect feed encoding by using the declared encoding in the xml processing instruction and by detecting the characters used in the
	 * feed
	 *
	 */
	public Charset getEncoding(byte[] bytes) {
		String extracted = extractDeclaredEncoding(bytes);
		if (StringUtils.startsWithIgnoreCase(extracted, "iso-8859-")) {
			if (!StringUtils.endsWith(extracted, "1")) {
				return Charset.forName(extracted);
			}
		} else if (StringUtils.startsWithIgnoreCase(extracted, "windows-")) {
			return Charset.forName(extracted);
		}
		return detectEncoding(bytes);
	}

	/**
	 * Extract the declared encoding from the xml
	 */
	public String extractDeclaredEncoding(byte[] bytes) {
		int index = ArrayUtils.indexOf(bytes, (byte) '>');
		if (index == -1) {
			return null;
		}

		String pi = new String(ArrayUtils.subarray(bytes, 0, index + 1)).replace('\'', '"');
		index = StringUtils.indexOf(pi, "encoding=\"");
		if (index == -1) {
			return null;
		}
		String encoding = pi.substring(index + 10);
		encoding = encoding.substring(0, encoding.indexOf('"'));
		return encoding;
	}

	/**
	 * Detect encoding by analyzing characters in the array
	 */
	private Charset detectEncoding(byte[] bytes) {
		UniversalDetector detector = new UniversalDetector();
		detector.handleData(bytes);
		detector.dataEnd();
		String encoding = Optional.ofNullable(detector.getDetectedCharset()).orElse("UTF-8");
		if (encoding.equalsIgnoreCase("ISO-8859-1")) {
			encoding = "windows-1252";
		}
		return Charset.forName(encoding);
	}

}
