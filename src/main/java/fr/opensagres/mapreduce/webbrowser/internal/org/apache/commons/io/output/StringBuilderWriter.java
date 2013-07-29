/**
 * Copyright (C) 2011-2013 Angelo Zerr <angelo.zerr@gmail.com>
 *
 * All rights reserved.
 *
 * Permission is hereby granted, free  of charge, to any person obtaining
 * a  copy  of this  software  and  associated  documentation files  (the
 * "Software"), to  deal in  the Software without  restriction, including
 * without limitation  the rights to  use, copy, modify,  merge, publish,
 * distribute,  sublicense, and/or sell  copies of  the Software,  and to
 * permit persons to whom the Software  is furnished to do so, subject to
 * the following conditions:
 *
 * The  above  copyright  notice  and  this permission  notice  shall  be
 * included in all copies or substantial portions of the Software.
 *
 * THE  SOFTWARE IS  PROVIDED  "AS  IS", WITHOUT  WARRANTY  OF ANY  KIND,
 * EXPRESS OR  IMPLIED, INCLUDING  BUT NOT LIMITED  TO THE  WARRANTIES OF
 * MERCHANTABILITY,    FITNESS    FOR    A   PARTICULAR    PURPOSE    AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE,  ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
package fr.opensagres.mapreduce.webbrowser.internal.org.apache.commons.io.output;

import java.io.Serializable;
import java.io.Writer;

/**
 * {@link Writer} implementation that outputs to a {@link StringBuilder}.
 * <p>
 * <strong>NOTE:</strong> This implementation, as an alternative to
 * <code>java.io.StringWriter</code>, provides an <i>un-synchronized</i>
 * (i.e. for use in a single thread) implementation for better performance.
 * For safe usage with multiple {@link Thread}s then
 * <code>java.io.StringWriter</code> should be used.
 *
 * @version $Id: StringBuilderWriter.java 1304052 2012-03-22 20:55:29Z ggregory $
 * @since 2.0
 */
public class StringBuilderWriter extends Writer implements Serializable {

    private final StringBuilder builder;

    /**
     * Construct a new {@link StringBuilder} instance with default capacity.
     */
    public StringBuilderWriter() {
        this.builder = new StringBuilder();
    }

    /**
     * Construct a new {@link StringBuilder} instance with the specified capacity.
     *
     * @param capacity The initial capacity of the underlying {@link StringBuilder}
     */
    public StringBuilderWriter(int capacity) {
        this.builder = new StringBuilder(capacity);
    }

    /**
     * Construct a new instance with the specified {@link StringBuilder}.
     *
     * @param builder The String builder
     */
    public StringBuilderWriter(StringBuilder builder) {
        this.builder = builder != null ? builder : new StringBuilder();
    }

    /**
     * Append a single character to this Writer.
     *
     * @param value The character to append
     * @return This writer instance
     */
    @Override
    public Writer append(char value) {
        builder.append(value);
        return this;
    }

    /**
     * Append a character sequence to this Writer.
     *
     * @param value The character to append
     * @return This writer instance
     */
    @Override
    public Writer append(CharSequence value) {
        builder.append(value);
        return this;
    }

    /**
     * Append a portion of a character sequence to the {@link StringBuilder}.
     *
     * @param value The character to append
     * @param start The index of the first character
     * @param end The index of the last character + 1
     * @return This writer instance
     */
    @Override
    public Writer append(CharSequence value, int start, int end) {
        builder.append(value, start, end);
        return this;
    }

    /**
     * Closing this writer has no effect. 
     */
    @Override
    public void close() {
    }

    /**
     * Flushing this writer has no effect. 
     */
    @Override
    public void flush() {
    }


    /**
     * Write a String to the {@link StringBuilder}.
     * 
     * @param value The value to write
     */
    @Override
    public void write(String value) {
        if (value != null) {
            builder.append(value);
        }
    }

    /**
     * Write a portion of a character array to the {@link StringBuilder}.
     *
     * @param value The value to write
     * @param offset The index of the first character
     * @param length The number of characters to write
     */
    @Override
    public void write(char[] value, int offset, int length) {
        if (value != null) {
            builder.append(value, offset, length);
        }
    }

    /**
     * Return the underlying builder.
     *
     * @return The underlying builder
     */
    public StringBuilder getBuilder() {
        return builder;
    }

    /**
     * Returns {@link StringBuilder#toString()}.
     *
     * @return The contents of the String builder.
     */
    @Override
    public String toString() {
        return builder.toString();
    }
}
